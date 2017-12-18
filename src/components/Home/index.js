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
    };

    this.onAddMessage = this.onAddMessage.bind(this);
    this.onChangeMessage = this.onChangeMessage.bind(this);
  }

  componentWillMount() {
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
    const { messages, value } = this.state;

    return (
      <div>
        <form onSubmit={this.onAddMessage}>
          <input
            type="text"
            value={value}
            onChange={this.onChangeMessage}
          />
          <button type="submit">Send</button>
        </form>

        <ul>
          {messages.map(message =>
            <li key={message.id}>{message.text}</li>
          )}
        </ul>
      </div>
    );
  }
}

HomePage.contextTypes = {
  authUser: PropTypes.object,
};

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);