const jwt = require('jsonwebtoken');

const SECRET_KEY = 'mE29912016kH2202069230'

const ourToken = jwt.sign(
  {
    name: 'Kayo',
  },
  SECRET_KEY,
  {
    expiresIn: '10s',
    subject: '1'
  }
);
console.log(ourToken);
const TOKEN_GENERATED = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

// console.log(jwt.verify(TOKEN_GENERATED, 'other-key'));
console.log(jwt.decode(ourToken));
