import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { DbService } from '../db.js'


const router = Router();

function usersCol() {
  return DbService.db().collection('users')
}

async function encodePassword(pw) {
  return bcrypt.hash(pw, 12)
}

async function verifyPassword(pw, hash) {
  return bcrypt.compare(pw, hash)
}

const createToken = () => {
  return jwt.sign({}, 'secret', { expiresIn: '1h' });
};

router.post('/login', async (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;
  // Check if user login is valid
  // If yes, create token and return it to client

  usersCol()
    .findOne({_id: email})
    .then(async user => {
      console.log(user)
      if (user !== null && await verifyPassword(pw, user.pw)) {
        const token = createToken();
        res
          .status(200)
          .json({ token: token, user: { email } });
      } else {
        res
          .status(401)
          .json({ message: 'Authentication failed, invalid username or password.' });
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: 'An error occured' });
    });

});

router.post('/signup', async (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;

  // Hash password before storing it in database => Encryption at Rest
  const hashedPW = await encodePassword(pw)

  console.log(hashedPW);

  // Store hashedPW in database
  // Add user to database
  usersCol()
    .insertOne({_id: email, email, pw: hashedPW})
    .then(response => {
      console.log(response)
      const token = createToken();
      res
        .status(201)
        .json({ token: token, user: { email } });
      })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: 'An error occured' });
    });
});

export default router;
