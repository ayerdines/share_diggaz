import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  CardHeader,
  Col,
  Row,
  InputGroup,
  InputGroupAddon, InputGroupText, Container, NavbarBrand
} from 'reactstrap';
import axios from 'axios';
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute('content');
    event.preventDefault();

    axios({
      method: 'POST',
      url: '/auth/sign_in.json',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrf,
      },
      data: {
        user: { email, password },
      },
    }).then((response) => {
      if (response.status === 201) {
        window.location.href = '/';
      }
    }).catch(() => {
    });
  }

  return (
    <>
      <div className="header bg-gradient-info py-7 py-lg-8">
        <Container>
          <div className="header-body text-center mb-7">
            <Row className="justify-content-center">
              <Col lg="5" md="6">
                <h1 className="text-white">Welcome!</h1>
              </Col>
            </Row>
          </div>
        </Container>
        <div className="separator separator-bottom separator-skew zindex-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon
              className="fill-default"
              points="2560 0 2560 100 0 100"
            />
          </svg>
        </div>
      </div>
      <Container className="mt--8 pb-5">
        <Row className="justify-content-center">
          <Col xs={6}>
            <Card className="bg-secondary shadow border-0">
              <CardBody className="px-lg-5 py-lg-5">
                <Form role="form" onSubmit={handleSubmit}>
                  <FormGroup className="mb-3">
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-email-83" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="email" id="email" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" id="password" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    </InputGroup>
                  </FormGroup>
                  <div className="text-center">
                    <Button className="my-4" color="primary" type="submit">
                      Sign in
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Login />,
    document.getElementById('root'),
  );
});
