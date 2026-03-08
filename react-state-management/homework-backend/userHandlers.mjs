import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

let users = [];

export const register = (req, res) => {
    const { username, password } = req.body;
    if(users.some(user => user.username === username)) {
        return res.status(400).json({ message: 'Пользователь уже существует.' });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    users.push({ username, password: hashedPassword});
    res.status(201).json({ message: 'Регистрация прошла успешно!' });
};

export const login = (req, res) => {
    const { username, password } = req.body;
    let user = users.find(user => user.username === username);
    if(!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ message: 'Имя пользователя или пароль введены неверно.' });
    }
    const token = jwt.sign({username: user.username}, 'your_jwt_secret_key');
    res.json({ token });
};