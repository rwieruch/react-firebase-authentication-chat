import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withAuthorization from '../Session/withAuthorization';
import { db } from '../../firebase';

class HomePage extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      messages: [],
      users: {},
    };

    this.onAddMessage = this.onAddMessage.bind(this);
    this.onChangeMessage = this.onChangeMessage.bind(this);
  }

  componentWillMount() {
    db.onceGetUsers().then(snapshot =>
      this.setState(() => ({ users: snapshot.val() }))
    );

    db.onMessageAdded((snapshot) => {
      this.setState(prevState => ({
        messages: [ snapshot.val(), ...prevState.messages ],
      }));
    });
  }

  onChangeMessage(event) {
    const { value } = event.target;
    this.setState(() => ({ value }));
  }

  onAddMessage(event) {
    event.preventDefault();

    const { authUser } = this.context;
    const { value } = this.state;

    db.doCreateMessage(authUser.uid, value);

    this.setState(() => ({ value: '' }));
  }

  render() {
    const {
      messages,
      users,
      value,
    } = this.state;

    return (
      <div>
        <ul>
          {messages.map((message, key) =>
            <Message
              key={key}
              message={message}
              user={users[message.userId]}
            />
          )}
        </ul>

        <form onSubmit={this.onAddMessage}>
          <input
            type="text"
            value={value}
            onChange={this.onChangeMessage}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    );
  }
}

const Message = ({ message, user }) => {
  const messenger = user
    ? `${user.username}:`
    : '???';

  return <li><strong>{messenger}</strong> {message.text}</li>;
}

HomePage.contextTypes = {
  authUser: PropTypes.object,
};

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);