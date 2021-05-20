import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {Card, CardBody, Form, FormGroup, Input, Label, Button, CardHeader, Col, Row} from 'reactstrap';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute('content');
    event.preventDefault();

    axios({
      method: 'POST',
      url: '/users/sign_in.json',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrf,
      },
      data: {
        user: { email, password },
      },
    }).then((response) => {
      debugger;
      if (response.status === 201) {
        window.location.href = '/';
      }
    }).catch(() => {
      debugger;
    });
  }

  return (
    <div className="content">
      <Row className="mt-4">
        <Col sm="12" md={{ size: 6, offset: 3 }}>
          <Form>
            <Card>
              <CardHeader>Log In</CardHeader>
              <CardBody>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input type="email" id="email" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input type="password" id="password" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                </FormGroup>
                <Button onClick={handleSubmit}>Submit</Button>
              </CardBody>
            </Card>
          </Form>
        </Col>
      </Row>
    </div>
  )
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Login />,
    document.getElementById('root'),
  );
});
