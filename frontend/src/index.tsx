import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { AppContextProvider } from './AppContext';
import NavBar from './components/NavBar';
import Home from './routes/Home';
import Session from './helpers/Session';

import { IUser } from 'dc2410-coursework-common';

interface IState {
  user?: IUser;
  setUser: (u: IUser) => void;
  wipeUser: () => void;
}

class App extends React.Component<{}, IState> {
  public state: IState = {
    setUser: user => this.setState({ user }),
    wipeUser: () => this.setState({ user: undefined }),
  };

  public componentDidMount = async () => {
    if (Session.isValid() && !this.state.user) {
      this.setState({ user: Session.getUser() });
    }
  }

  public render = () => {
    const context = {
      user: this.state.user,
      setUser: this.state.setUser,
      wipeUser: this.state.wipeUser,
    };

    return (
      <AppContextProvider value={context}>
        <NavBar />
        <Home />
      </AppContextProvider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
