import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  FormGroup,
  Input,
  Row
} from "reactstrap";


export default function Form() {
  return (
    <>
      <Container className="pb-8 pt-5 pt-md-8" fluid>
        <Row className="mt-5">
          <Card className="shadow">
            <CardHeader className="border-0">
              <h3 className="mb-0">Add Stock</h3>
            </CardHeader>
            <CardBody>
              <Form>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Input
                        id="exampleFormControlInput1"
                        placeholder="name@example.com"
                        type="email"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Input disabled placeholder="Regular" type="text" />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup className="has-success">
                      <Input
                        className="is-valid"
                        placeholder="Success"
                        type="text"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup className="has-danger">
                      <Input
                        className="is-invalid"
                        placeholder="Error Input"
                        type="email"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Row>
      </Container>
    </>
  )
}