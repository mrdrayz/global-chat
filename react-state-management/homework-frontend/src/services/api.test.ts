import { registerUser, loginUser, fetchChats, sendMessage } from "./api";

const MOCK_TOKEN = "test-token-123";

const mockFetch = (response: {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}): void => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => Promise.resolve(response)),
  );
};

const getCalledWith = (): [string, RequestInit] => {
  const mock = global.fetch as unknown as ReturnType<typeof vi.fn>;
  return mock.mock.calls[0] as [string, RequestInit];
};

describe("API service", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("registerUser", () => {
    it("should send POST request to /register", async () => {
      const mockResponse = { message: "Регистрация прошла успешно!" };
      mockFetch({ ok: true, status: 201, json: async () => mockResponse });

      const result = await registerUser({
        username: "testuser",
        password: "testpass",
      });

      const [url, options] = getCalledWith();
      expect(url).toBe("http://localhost:3001/register");
      expect(options.method).toBe("POST");
      expect(options.body).toBe(
        JSON.stringify({ username: "testuser", password: "testpass" }),
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw error when user already exists", async () => {
      mockFetch({
        ok: false,
        status: 400,
        json: async () => ({ message: "Пользователь уже существует." }),
      });

      await expect(
        registerUser({ username: "existing", password: "pass" }),
      ).rejects.toThrow("Пользователь уже существует.");
    });
  });

  describe("loginUser", () => {
    it("should send POST request to /login", async () => {
      const mockResponse = { token: MOCK_TOKEN };
      mockFetch({ ok: true, status: 200, json: async () => mockResponse });

      const result = await loginUser({
        username: "testuser",
        password: "testpass",
      });

      const [url, options] = getCalledWith();
      expect(url).toBe("http://localhost:3001/login");
      expect(options.method).toBe("POST");
      expect(result.token).toBe(MOCK_TOKEN);
    });

    it("should throw error on invalid credentials", async () => {
      mockFetch({
        ok: false,
        status: 400,
        json: async () => ({
          message: "Имя пользователя или пароль введены неверно.",
        }),
      });

      await expect(
        loginUser({ username: "wrong", password: "wrong" }),
      ).rejects.toThrow("Имя пользователя или пароль введены неверно.");
    });
  });

  describe("fetchChats", () => {
    it("should send GET request with auth header", async () => {
      const mockMessages = [{ username: "user1", body: "hello" }];
      mockFetch({ ok: true, status: 200, json: async () => mockMessages });

      const result = await fetchChats(MOCK_TOKEN);

      const [url, options] = getCalledWith();
      expect(url).toBe("http://localhost:3001/chats");
      expect(options.method).toBe("GET");
      expect(options.headers).toEqual(
        expect.objectContaining({
          Authorization: `Bearer ${MOCK_TOKEN}`,
        }),
      );
      expect(result).toEqual(mockMessages);
    });

    it("should throw error on 401", async () => {
      mockFetch({
        ok: false,
        status: 401,
        json: async () => ({}),
      });

      await expect(fetchChats("invalid")).rejects.toThrow();
    });
  });

  describe("sendMessage", () => {
    it("should send POST request with message body", async () => {
      const mockResponse = { message: "Message sent" };
      mockFetch({ ok: true, status: 201, json: async () => mockResponse });

      const result = await sendMessage(MOCK_TOKEN, { body: "hello" });

      const [url, options] = getCalledWith();
      expect(url).toBe("http://localhost:3001/chats");
      expect(options.method).toBe("POST");
      expect(options.body).toBe(JSON.stringify({ body: "hello" }));
      expect(options.headers).toEqual(
        expect.objectContaining({
          Authorization: `Bearer ${MOCK_TOKEN}`,
        }),
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
