import React, {useEffect, useRef, useState} from "react";
import {
  Card,
  CardHeader, Col,
  Container,
  Row, FormGroup, Input, CardBody, Label, Form, Button,
} from "reactstrap";
import apiCall from "../../helpers/apiCall";
import moment from 'moment';

const roles = [
  {
    label: 'User',
    value: 'user'
  },
  {
    label: 'Admin',
    value: 'admin'
  }
]

const initialStates = {
  email: '',
  password: '',
  role: roles[0].value
}

export default function UserForm({ match, history }) {
  const [inputs, setInputs] = useState(initialStates);

  useEffect(() => {
  }, [])
  if (match.params.id) {
    apiCall.fetchEntities(`/users/${match.params.id}`)
      .then((response) => {
        const { attributes } = response.data.data;
        const inputData = {
          email: attributes.email || '',
          role: attributes.role || 'user',
        }
        setInputs(inputData);
      })
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const method = match.params.id ? 'PATCH' : 'POST'
    const url = match.params.id ? `/users/${match.params.id}` : '/users'
    const data = {
      user: inputs
    }

    apiCall.submitEntity(data, url, method)
      .then(() => {
        history.push('/admin/users')
      }).catch(() => {});
  }

  const handleFormInputChange = (event) => {
    setInputs((inputData) => ({ ...inputData, [event.target.name]: event.target.value }));
  }

  return (
    <>
      <Container className="mt--9 mb-5" fluid>
        <Row className="mt-5">
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Users</h3>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleFormSubmit}>
                  <Row>
                    <Col md="12">
                      <Row>
                        <Col md={4}>
                          <FormGroup>
                            <Label>Email</Label>
                            <Input type="email" name="email" value={inputs.email} onChange={handleFormInputChange} />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={4}>
                          <FormGroup>
                            <Label>Password</Label>
                            <Input type="password" name="password" value={inputs.password} onChange={handleFormInputChange} />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={4}>
                          <FormGroup>
                            <Label>Role</Label>
                            <Input type="select" value={inputs.role} name="role" onChange={handleFormInputChange} >
                              { roles.map((role, index) => {
                                return (<option key={String(index)} value={role.value}>{role.label}</option>)
                              })}
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Button type="submit" color="info">Submit</Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}