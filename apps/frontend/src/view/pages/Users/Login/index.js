//noinspection ES6RedundantAwait

import m from 'mithril'
// import logo from 'Assets/images/logo-lettermark.svg'
import { Button, primary } from 'Components/UI/Button'
import { Toast } from 'Components/Toast'
import { authenticate } from 'Client/lib'
import { title as _title } from 'Config'
import { getFormData } from 'Lib'
import { page } from 'Pages/style.module.scss'
import { paths } from 'Router'
import {
  body,
  caption,
  form,
  input,
  title,
  titleLogo,
  titleText
} from '../auth.module.scss'


const
  Login = `.${page}.${body}`,
  Form = `form.${form}`,
  Input = `input.${input}`,
  Title = `.${title}`,
  { Link } = m.route


export default () => {
  return {
    view() { return m( Login, [
      // Title
      m( Title, _title ),
      // m( '', { class: title }, [
      //   /*m( 'svg', { class: titleLogo },
      //     m( 'use', { href: `${logo}#icon` })
      //   ),*/
      // ]),

      // Form
      m( Form, { onsubmit, class: form }, [
        // Username
        m( Input, {
          name: 'username',
          placeholder: 'Username',
          required: true,
          //autocomplete: 'username',
          autocomplete: 'off',
          autofocus: 'autofocus',
          type: 'text',
        }),

        // Password
        m( Input, {
          name: 'password',
          'data-name': 'password',
          placeholder: 'Password',
          required: true,
          autocomplete: 'current-password',
          type: 'password',
        }),

        // Submit
        m( Button, { class: `m-t-1`, type: 'submit' }, 'Login' ),

        // Sign Up
        m( Link, { class: 'b center m-t-1', href: paths.users.signup }, 'Sign up' )
      ]),
    ])}
  }
}


async function onsubmit( e ) {
  e.preventDefault()

  try {
    // Authenticate and route to home.
    await authenticate( getFormData( e.target ), true )
    m.route.set( paths.home )
    Toast.add( 'Successfully logged in' )

  } catch ( err ) {
    // Get password input.
    const password = e.target
      .querySelector( '[data-name=password]' )

    // Log error.
    console.error( err )

    // Clear password and refocus.
    password.value = ''
    password.focus()

    // Notify user.
    Toast.add( 'Login failed' )
  }
}
