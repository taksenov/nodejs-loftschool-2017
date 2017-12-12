import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { authorizeUser } from './AuthorizeApi';

class Auth extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            authError: undefined,
            isAuthorized: this.props.isAuthorized
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
    } //constructor

    onInputChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    } //onInputChange

    handleSubmit() {
        const { email, password } = this.state;
        this.setState({
            authError: authorizeUser(email, password),
            isAuthorized: authorizeUser(email, password)
        });
    } // handleSubmit

    render() {
        const { authError, isAuthorized } = this.state;

        return (
            <div>
                {isAuthorized === true ? (
                    <Redirect from="/auth" to="/" />
                ) : (
                    <div>
                        <input
                            name="email"
                            type="text"
                            placeholder="Email"
                            onChange={this.onInputChange}
                        />
                        <br />
                        <br />
                        <input
                            name="password"
                            type="text"
                            placeholder="Password"
                            onChange={this.onInputChange}
                        />
                        <br />
                        <br />
                        <button onClick={this.handleSubmit}>Sign In</button>

                        {authError === false ? (
                            <div>
                                <p className="error">
                                    <span>
                                        <strong>
                                            You entered an invalid email or
                                            password. Please try again
                                        </strong>
                                    </span>
                                </p>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        );
    } //render
}

export default Auth;
