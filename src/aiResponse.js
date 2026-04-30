export const aiResponse = {
  version: 'v0.9',
  nodes: [
    {
      id: 'root',
      component: 'ui:Column',
      props: {
        children: ['node-1', 'node-2', 'node-3', 'node-4']
      }
    },
    {
      id: 'node-1',
      component: 'ui:Card',
      props: {
        title: 'Login',
        content: 'Welcome back! Enter your username and password to sign in.'
      }
    },
    {
      id: 'node-2',
      component: 'ui:TextInput',
      props: {
        label: 'Username',
        placeholder: 'Enter your username'
      }
    },
    {
      id: 'node-3',
      component: 'ui:PasswordInput',
      props: {
        label: 'Password',
        placeholder: 'Enter your password',
        type: 'password'
      }
    },
    {
      id: 'node-4',
      component: 'ui:CustomButton',
      props: {
        label: 'Login',
        action: 'submit_login'
      }
    }
  ]
};