//noinspection ES6RedundantAwait

import m from 'mithril'
import { serverConfig } from '@bad-software/ld53-config'
import { client } from 'Client'
import { Button } from 'Components/UI/Button'
import { Toast } from 'Components/Toast'
import { title as _title } from 'Config'
import { authenticate } from 'Client/lib'
import { getFormData } from 'Lib'
import { paths } from 'Router'
import { page } from 'Pages/style.module.scss'
import {
  body,
  caption,
  form,
  input,
  title,
  // titleLogo,
  // titleText,
} from '../auth.module.scss'


const
  { api } = serverConfig,

  Signup = `.${page}.${body}`,
  Form = `form.${form}`,
  Input = `input.${input}`,
  Title = `.${title}`,
  { Link } = m.route


export default () => {
  return {
    view() { return m( Signup, [
      // Title
      m( Title, _title ),
      // m( '', { class: title }, [
      //   m( 'svg', { class: titleLogo },
      //     m( 'use', { href: `${logo}#icon` })
      //   ),
      // ]),

      // Caption
      m( 'p.m-b-2', { class: caption },
        `Sign up for a new ${_title} account.`
      ),

      // Form
      m( Form, { onsubmit }, [
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
        m( Button, { class: 'm-t-1', type: 'submit' }, 'Sign Up' ),

        // Log in
        m( Link,
          { class: 'b center m-t-1', href: paths.users.login },
          'Log in'
        ),
      ]),
    ])}
  }
}


async function onsubmit( e ) {
  e.preventDefault()

  try {
    const { username, password } = getFormData( e.target )

    // Create a user account.
    await client
      .service( api.users )
      .create({
        username,
        password,
      })

    // Log in to new account.
    await authenticate({ username, password }, true )
    m.route.set( paths.home )
    Toast.add( 'Account created' )

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
    Toast.add( 'Signup failed' )
  }
}
