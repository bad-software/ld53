import m from 'mithril'
import { query as q } from 'libmq'

import home from 'Assets/icons/home.svg'
import account from 'Assets/icons/account.svg'
import discover from 'Assets/icons/search1.svg'
import manage from 'Assets/icons/folder.svg'
import profile from 'Assets/icons/profile.svg'
import settings from 'Assets/icons/gear.svg'
import upload from 'Assets/icons/upload.svg'

import { ContextMenu } from 'Components/ContextMenu'
import { Header } from 'Components/Header'
import { Nav } from 'Components/Nav'
import { Toasts } from 'Components/Toast'
import { User } from 'Models/User'
import { Nav as _Nav } from 'Models/Nav'
import { paths } from 'Router'

import {
  content_container,
  defaultLayout,
  defaultLayout_wrapper
} from './style.module.scss'


// Navigation menu
const
  authenticatedNavItems = [
    // Name, Path, Icon
    /*[ 'Shortcuts', [
      [ 'Home', paths.home, home ],
    ]],*/
    // Discover
    [ '', [
      [ 'Home'    , () => paths.home    , home ],
      [ 'Discover', () => paths.discover, discover ],
      //[ 'Tags'    , () => paths.insights, insights ],
      //[ 'Guilds'  , () => paths.guilds  , discover ],
      //[ 'Sources' , () => paths.sources , sources ],
    ]],

    // Data
    [ '<hr style="margin: 0;">', [
      [ 'New Post', () => paths.upload, upload ],
      [ 'My Posts', () => paths.files , manage ],
    ]],

    // User
    [ '<hr style="margin: 0;">', [
      [ 'Profile' , () => `/${User.current().uri}`, profile  ],
      [ 'Account' , () => paths.account                , account  ],
      [ 'Settings', () => paths.settings               , settings ],
    ]]
  ],

  unAuthenticatedNavItems = [
    // Name, Path, Icon
    [ '', [
      [ 'Home', () => paths.home, home ],
    ]]
  ]


export function Default() {
  let
    address = '',
    desktop = q.desktopUp(),
    user = User.current(),
    menuItems = unAuthenticatedNavItems

  return {
    onupdate() {
      desktop = q.desktopUp()
      console.log( '%c m.redraw()', 'color: forestgreen;' )
    },
    view({ children }) {
      user = User.current()
      menuItems = user
        ? authenticatedNavItems
        : unAuthenticatedNavItems

      return m( '', { class: defaultLayout_wrapper }, [
        // UI
        m( ContextMenu ),
        m( Toasts ),

        !desktop && m( Nav, { items: menuItems }),

        // Content
        m(
          `.${defaultLayout}${_Nav.isOpen ? '.blur' : ''}`,
          [
            m( Header, { address }),
            m( '', { class: content_container }, [
              desktop && m( Nav, { items: menuItems, desktop: true }),
              children,
            ])
          ]
        ),
      ])
    }
  }
}
