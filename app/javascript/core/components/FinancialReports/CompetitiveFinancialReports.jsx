import React, { useEffect, useMemo, useState } from "react";
import ReactTable from '../ReactTable';
import { Button, Card, CardBody, Col, Container, Input, Row } from "reactstrap";
import apiCall from "../../helpers/apiCall";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

export default function CompetitiveFinancialReports({ history }) {
  const [sectorOptions, setSectorOptions] = useState([]);
  const [sector, setSector] = useState('commercial_banks');
  const [quarters, setQuarters] = useState([]);
  const [financialReports, setFinancialReports] = useState([]);

  useEffect(() => {
    fetchFinancialReports();
  }, [sector])

  useEffect(() => {
    fetchSectorOptions();
  }, [])

  const fetchFinancialReports = () => {
    apiCall.fetchEntities('/financial_reports.json', { sector: sector })
      .then((response) => {
        const { data, meta } = response.data;
        const financialReportsData = groupByQuarters(data, meta.quarters, meta.symbols, meta.close_prices);
        setQuarters(meta.quarters)
        setFinancialReports(financialReportsData);
      }).catch(() => {});
  }

  const groupByQuarters = (data, qtrs, symbols, close_prices) => {
    const finalData = []
    const dataFormatted = data.map((datum) => datum.attributes)
    symbols.map((symbol) => {
      const formattedCompanyData = dataFormatted.filter((r) => r.symbol === symbol)
      if (formattedCompanyData.length === 0){
        return;
      }
      const companyData = {};
      companyData.symbol = symbol
      companyData.close_price = (close_prices.find((r) => r.symbol === symbol) || {}).close_price
      formattedCompanyData.map((d) => {
        const quarter = `${d.year}Q${d.quarter}`;
        ['quarter', 'net_profit', 'net_interest_income', 'distributable_profit', 'shares_outstanding', 'book_value', 'eps', 'roe'].map((p) => {
          companyData[`${p}${quarter}`] = d[p];
        })
      })
      finalData.push(JSON.parse(JSON.stringify(companyData)))
    })
    return finalData;
  }

  const fetchSectorOptions = () => {
    apiCall.fetchEntities('/companies/sector_options.json')
      .then((response) => {
        const { data } = response;
        setSectorOptions(data);
      }).catch(() => {});
  }

  const syncSectorFinancialReports = () => {
    apiCall.submitEntity({ sector: sector },'/financial_reports/sync.json')
      .then((response) => {
        alert('Sync Started');
      }).catch(() => {});
  }

  const data = useMemo(() => financialReports, [financialReports]);

  const quarterColumns = (tab) => {
    return quarters.map((q) => {
      const header = q.join('Q')
      return {
        Header: header,
        accessor: `${tab}${header}`,
        sortDescFirst: true,
      }
    })
  }

  const columns = (tab) => {
    return [
      {
        Header: 'Company',
        accessor: 'symbol',
      },
      {
        Header: 'Previous Closing Price',
        accessor: 'close_price',
      },
      ...quarterColumns(tab)
    ]
  }

  const epsColumns = useMemo(
    () => columns('eps'), [financialReports]
  )

  const bookValueColumns = useMemo(
    () => columns('book_value'), [financialReports]
  )

  const roeColumns = useMemo(
    () => columns('roe'), [financialReports]
  )

  const netProfitColumns = useMemo(
    () => columns('net_profit'), [financialReports]
  )

  const netInterestIncomeColumns = useMemo(
    () => columns('net_interest_income'), [financialReports]
  )

  const distributableProfitColumns = useMemo(
    () => columns('distributable_profit'), [financialReports]
  )

  return (
    <>
      <Container className="pb-8 pt-5 pt-md-8" fluid>
        <Row>
          <Col md={3}>
            <Input type="select" bsSize="md" onChange={(event) => setSector(event.target.value)}>
              { sectorOptions.map((sector, index) => <option key={String(index)} value={sector.value}>{sector.label}</option> )}
            </Input>
          </Col>
          <Col md={9}>
            <Button color="primary" type="button" onClick={syncSectorFinancialReports}>
              Sync Sector Financial Reports
            </Button>
          </Col>
          <Col>
            <Row className="mt-5">
              <Col>
                <Tabs>
                  <TabList>
                    <Tab>EPS</Tab>
                    <Tab>Book Value</Tab>
                    <Tab>ROE</Tab>
                    <Tab>Net Profit</Tab>
                    <Tab>Net Interest Income</Tab>
                    <Tab>Distributable Profit</Tab>
                  </TabList>

                  <TabPanel>
                    <Card className="shadow">
                      <CardBody>
                        <ReactTable data={data} columns={epsColumns} />
                      </CardBody>
                    </Card>
                  </TabPanel>
                  <TabPanel>
                    <Card className="shadow">
                      <CardBody>
                        <ReactTable data={data} columns={bookValueColumns} />
                      </CardBody>
                    </Card>
                  </TabPanel>
                  <TabPanel>
                    <Card className="shadow">
                      <CardBody>
                        <ReactTable data={data} columns={roeColumns} />
                      </CardBody>
                    </Card>
                  </TabPanel>
                  <TabPanel>
                    <Card className="shadow">
                      <CardBody>
                        <ReactTable data={data} columns={netProfitColumns} />
                      </CardBody>
                    </Card>
                  </TabPanel>
                  <TabPanel>
                    <Card className="shadow">
                      <CardBody>
                        <ReactTable data={data} columns={netInterestIncomeColumns} />
                      </CardBody>
                    </Card>
                  </TabPanel>
                  <TabPanel>
                    <Card className="shadow">
                      <CardBody>
                        <ReactTable data={data} columns={distributableProfitColumns} />
                      </CardBody>
                    </Card>
                  </TabPanel>
                </Tabs>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}