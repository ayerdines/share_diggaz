import React, { useEffect, useMemo, useState } from 'react';
import ReactTable from "../ReactTable";
import apiCall from "../../helpers/apiCall";
import {
  Button,
  Card,
  CardHeader,
  Col,
  Container,
  Row
} from "reactstrap";

export default function Index() {
  const [companies, setCompanies] = useState([]);
  const [lastSynced, setLastSynced] = useState('');

  useEffect(() => {
    apiCall.fetchEntities('/companies.json')
      .then((response) => {
        const { data } = response.data;
        const companiesData = data.map((datum) => datum.attributes);
        if (companiesData.length) {
          setLastSynced(companiesData[0].updated_at);
        }
        setCompanies(companiesData);
      }).catch(() => {});
  }, [])


  const syncCompanies = () => {
    apiCall.submitEntity({},'/companies/sync.json')
      .then((response) => {
        alert('Sync Started');
      }).catch(() => {});
  }

  const data = useMemo(() => companies, [companies]);
  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'nepse_company_id',
      },
      {
        Header: 'Security Name',
        accessor: 'security_name',
      },
      {
        Header: 'Symbol',
        accessor: 'symbol',
      },
      {
        Header: 'Sector',
        accessor: 'sector',
      },
    ],
    []
  )

  return (
    <>
      <Container className="pb-8 pt-5 pt-md-8" fluid>
        <Row>
          <Col xs={12}>
            <Button color="primary" type="button" onClick={syncCompanies}>
              Sync Companies
            </Button>
            { ' ' }
            Last Synced on: { lastSynced ? lastSynced : 'Never synced'}
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Companies</h3>
              </CardHeader>
              <ReactTable columns={columns} data={data} />
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}