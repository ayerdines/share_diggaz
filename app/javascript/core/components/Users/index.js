import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, CardHeader, Col, Container, Row } from "reactstrap";
import ReactTable from '../ReactTable';
import apiCall from "../../helpers/apiCall";
import SweetAlert from 'react-bootstrap-sweetalert';

export default function Index({ history }) {
  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [])

  const fetchUsers = () => {
    apiCall.fetchEntities('/users.json')
      .then((response) => {
        const { data } = response.data;
        const usersData = data.map((datum) => datum.attributes);
        setUsers(usersData);
      }).catch(() => {});
  }

  const deleteUser = (id) => {
    apiCall.deleteEntity(`/users/${id}`)
      .then(() => {
        const userData = users.filter((w) => w.id !== id);
        setAlert(null);
        setUsers(userData);
      }).catch(() => {});
  }

  const deleteWithWarning = (id) => {
    setAlert(<SweetAlert
      warning
      showCancel
      confirmBtnText="Yes, delete it!"
      confirmBtnBsStyle="danger"
      title="Are you sure?"
      onConfirm={() => {deleteUser(id)}}
      onCancel={() => setAlert(null)}
      focusCancelBtn
    />);
  }

  const tableData = useMemo(() => users, [users]);
  const columns = useMemo(
    () => [
      {
        Header: 'Email',
        accessor: 'email'
      },
      {
        Header: 'Role',
        accessor: 'role'
      },
      {
        Header: 'Actions',
        Cell: ({ row }) => {
          return (<div className="actions-right">
            <Button
              onClick={() => {
                history.push(`/admin/users/${row.original.id}/edit`);
              }}
              color="primary"
              className="btn-icon"
              size="sm"
            >
              <i className="ni ni-ruler-pencil" />
            </Button>
            <Button
              onClick={() => deleteWithWarning(row.original.id)}
              color="warning"
              size="sm"
              className="btn-icon"
            >
              <i className="ni ni-fat-remove" />
            </Button>
          </div>)
        }
      }
    ], [users]
  )

  return (
    <>
      <Container className="mt--9 mb-5" fluid>
        { alert }
        <Row>
          <Col xs={12}>
            <Button color="primary" type="button" onClick={() => history.push('/admin/users/new')}>
              Create User
            </Button>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Users</h3>
              </CardHeader>
              <ReactTable data={tableData} columns={columns} />
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}