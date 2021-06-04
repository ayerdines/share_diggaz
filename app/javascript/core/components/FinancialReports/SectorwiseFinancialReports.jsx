import React, { useContext, useEffect, useMemo, useState } from "react";
import ReactTable from '../ReactTable';
import { Button, Card, CardBody, Col, Container, Input, Row } from "reactstrap";
import apiCall from "../../helpers/apiCall";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import adminCanAccess from "../../helpers/Authorization";
import Select from "react-select";

export default function SectorwiseFinancialReports({ history }) {
  const [sectorOptions, setSectorOptions] = useState([]);
  const [sector, setSector] = useState('commercial_banks');
  const [quarters, setQuarters] = useState([]);
  const [symbolOptions, setSymbolOptions] = useState([])
  const [selectedSymbols, setSelectedSymbols] = useState([])
  const [financialReports, setFinancialReports] = useState([]);

  useEffect(() => {
    fetchFinancialReports();
  }, [sector])

  useEffect(() => {
    fetchSymbolOptions()
    fetchSectorOptions();
  }, [])

  const fetchSymbolOptions = () => {
    apiCall.fetchEntities('/companies/symbol_options.json')
      .then((response) => {
        const { data } = response;
        const optionsData = data.map((company) => {
          return { label: `${company.symbol}`, value: company.symbol, sector: company.sector }
        })
        setSymbolOptions(optionsData);
        setSelectedSymbols(optionsData.filter((d) => d.sector === sector))
      }).catch(() => {});
  }

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

  const handleSymbolsChange = (options) => {
    setSelectedSymbols(options);
  }

  const toggleSector = (event) => {
    setSector(event.target.value);
    setSelectedSymbols(symbolOptions.filter((d) => d.sector === event.target.value))
  }

  const data = useMemo(() => (
    financialReports.filter((report) => selectedSymbols.map((s) => s.value).includes(report.symbol))
  ), [financialReports, selectedSymbols]);

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
        style: {
          left: 0,
          background: 'white',
          position: 'sticky'
        }
      },
      {
        Header: 'LTP',
        accessor: 'close_price',
      },
      ...quarterColumns(tab)
    ]
  }

  const epsColumns = useMemo(
    () => columns('eps'), [financialReports, selectedSymbols]
  )

  const bookValueColumns = useMemo(
    () => columns('book_value'), [financialReports, selectedSymbols]
  )

  const roeColumns = useMemo(
    () => columns('roe'), [financialReports, selectedSymbols]
  )

  const netProfitColumns = useMemo(
    () => columns('net_profit'), [financialReports, selectedSymbols]
  )

  const netInterestIncomeColumns = useMemo(
    () => columns('net_interest_income'), [financialReports, selectedSymbols]
  )

  const distributableProfitColumns = useMemo(
    () => columns('distributable_profit'), [financialReports, selectedSymbols]
  )

  return (
    <>
      <Container className="mt--9 mb-5" fluid>
        <Row>
          <Col md={3}>
            <Input type="select" bsSize="md" onChange={toggleSector}>
              { sectorOptions.map((sector, index) => <option key={String(index)} value={sector.value}>{sector.label}</option> )}
            </Input>
          </Col>
          <Col md={9}>
            { adminCanAccess() && (
              <Button color="primary" type="button" onClick={syncSectorFinancialReports}>
                Sync Sector Financial Reports
              </Button>
            )}
          </Col>
        </Row>
        <br />
        <Row>
          <Col md={9}>
            <Select
              isMulti
              name="colors"
              value={selectedSymbols}
              options={symbolOptions.filter((d) => d.sector === sector)}
              onChange={handleSymbolsChange}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Row className="mt-5">
              <Col>
                <Tabs className="rounded-top bg-white">
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
