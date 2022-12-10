import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider, GithubAuthProvider } from "firebase/auth";
import app from './firebase.init';
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';



const auth = getAuth(app);

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);
  const [validated, setValidated] = useState(false);
  const [name, setName] = useState('')

  //handler add to email input field
  const handleEmail = (e) => {
    // console.log(e.target.value)
    setEmail(e.target.value)
  }
  //handler add to password input field
  const handlePassword = (e) => {
    // console.log(e.target.value)
    setPassword(e.target.value)
  }

  //handler add to form submit
  const handleSubmit = (e) => {
    console.log('form submitted')
    e.preventDefault();

    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      return;
    }


    setValidated(true);
    setError('')
    console.log(validated)
    if (registered) {

      signInWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user)
          setEmail('')
          setPassword('')
        })
        .catch(error => {
          console.error('error', error)
          setError(error.message)
        })
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user);
          setEmail('')
          setPassword('')
          verifyEmail()
          setUserName()

        })
        .catch(error => {
          console.error('error', error)
          setError(error.message);
        })
    }

  }

  //handler add to checkbox
  const handleRegisteredChange = (e) => {
    setRegistered(e.target.checked);
  }

  //email verification sent to email
  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log('Email verification sent')
      })
  }

  //password verification sent to email;
  const verifyPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('Password reset email sent');
      })
  }
  const handleName = (e) => {
    console.log(e.target.value)
    setName(e.target.value);

  }

  //updated user profile
  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name
    }).then(() => {
      console.log('profile updated')
    })
  }

  //signin with facebook
  const handleSignInWithFacebook = () => {
    console.log('facebook signined')
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then(result => {
        const user = result.user;
        console.log(user)
      }).catch(error => {
        console.error('error', error)

      })
  }

  //signin with google
  const handleSignInWithGoogle = () => {
    console.log('google sign in')
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(result => {
        const user = result.user;
        console.log(user)
      }).catch(error => {
        console.error('error', error)

      })
  }

  //signin with github
  const handleSignInWithGithub = () => {
    console.log('github sign in')
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
      .then(result => {
        const user = result.user;
        console.log(user)
      }).catch(error => {
        console.error('error', error)
      })

  }
  return (
    <div className='w-25 mx-auto'>
      <h2 className='text-primary mt-2'>Please {!registered ? 'Register!!!' : 'LogIn!'}</h2>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        {!registered && <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Your Name</Form.Label>
          <Form.Control onBlur={handleName} required type="text" placeholder="Enter Your Name" />
          <Form.Text className="text-muted">
            Please enter your name
          </Form.Text>
          <Form.Control.Feedback type="invalid">
            Please choose valid user name.
          </Form.Control.Feedback>
        </Form.Group>}

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control onBlur={handleEmail} required type="email" placeholder="Enter email" />
          <Form.Text className="text-muted" >
            We'll never share your email with anyone else.
          </Form.Text>
          <Form.Control.Feedback type="invalid">
            Please choose valid email.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control onBlur={handlePassword} required type="password" placeholder="Password" />
          <Form.Control.Feedback type="invalid">
            Please enter a password.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check onChange={handleRegisteredChange} type="checkbox" label="Already registered?" />
        </Form.Group>
        <p className='text-danger'>{error}</p>
        {registered && <Button onClick={verifyPassword} variant='link'>Forget Password</Button>

        }
        <br></br>
        <Button className='mt-2' variant="primary" type="submit">
          {registered ? 'Login' : 'Registered'}
        </Button>
        <br />
        <Button onClick={handleSignInWithFacebook} className='mt-2' variant='success' type='submit'>Sign In With Facebook</Button>
        <br />
        <Button onClick={handleSignInWithGoogle} className='mt-2' variant='info' type='submit'>Sign In With Google</Button>
        <br />
        <Button onClick={handleSignInWithGithub} className='mt-2' variant='warning' type='submit'>
          Sign In With Github
        </Button>
      </Form>
    </div>
  );
}

export default App;
