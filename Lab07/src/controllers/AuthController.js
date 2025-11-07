import authService from '../services/AuthService.js';

const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[#\$%&*@])[A-Za-z\d#\$%&*@]{8,}$/;

class AuthController {
  async signUp(req, res, next) {
    try {
      const {
        name,
        lastName,
        phoneNumber,
        birthdate,
        email,
        password,
        url_profile,
        adress
      } = req.body;

      if (!name || !lastName || !phoneNumber || !birthdate || !email || !password) {
        return res.status(400).json({
          message:
            'Los campos name, lastName, phoneNumber, birthdate, email y password son requeridos'
        });
      }

      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message:
            'Password inválido: mínimo 8 caracteres, 1 mayúscula, 1 dígito y 1 caracter especial (# $ % & * @).'
        });
      }

      const user = await authService.signUp({
        name,
        lastName,
        phoneNumber,
        birthdate,
        email,
        password,
        url_profile,
        adress
      });

      return res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'El email y password son requeridos' });
      }

      const { token } = await authService.signIn({ email, password });

      res.cookie('token', token, {
        httpOnly: true,
        secure: false,         
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60  
      });

      return res.status(200).json({ message: 'Login correcto', token });
    } catch (err) {
      next(err);
    }
  }

  // ✅ Opción: cerrar sesión (borra cookie)
  async logout(req, res) {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Sesión cerrada' });
  }
}

export default new AuthController();
