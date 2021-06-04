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
import adminCanAccess from "../../helpers/Authorization";

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

  const toggleCompanyStatus = (companyId) => {
    apiCall.submitEntity({},`/companies/${companyId}/toggle_status.json`)
      .then((response) => {
        const { data } = response.data;
        const company = data.attributes;
        const companyIndex = companies.findIndex((obj => obj.id === company.id));
        const c = companies[companyIndex];
        c.status = company.status;
        setCompanies([...companies.slice(0, companyIndex), c, ...companies.slice(companyIndex + 1)]);
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
      {
        Header: 'Actions',
        Cell: ({ row }) => {
          return (
            <div className="actions-right">
              { adminCanAccess() &&
              (
                <Button
                  onClick={() => toggleCompanyStatus(row.original.id)}
                  color={row.original.status === 'A' ? 'danger' : 'success'}
                  className="btn-icon"
                  size="sm"
                >
                  { row.original.status === 'A' ?
                    (<i className="fas fa-times-circle" />) :
                    (<i className="fas fa-check-circle" />)
                  }
                </Button>
              )}
            </div>
          )}
      }
    ],
    [companies]
  )

  return (
    <>
      <Container className="mt--9 mb-5" fluid>
        <Row>
          <Col xs={12}>
            { adminCanAccess() && (
              <>
                <Button color="primary" type="button" onClick={syncCompanies}>
                  Sync Companies
                </Button>
                {' '}
                Last Synced on: { lastSynced ? lastSynced : 'Never synced'}
              </>
            )}
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