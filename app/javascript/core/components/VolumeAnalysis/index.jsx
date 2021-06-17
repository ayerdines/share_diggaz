import React, { useEffect, useState } from 'react';
import {Col, Container, Input, Row} from "reactstrap";
import Chart from "./Chart";
import apiCall from "../../helpers/apiCall";

export default function Index(){
  const [formId, setFormId] = useState('')
  const [businessDate, setBusinessDate] = useState('')
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData()
  }, [businessDate, formId])


  const fetchData = () => {
    apiCall.fetchEntities('/companies/symbol_options.json')
      .then((response) => {
        const { data } = response;
        const symbolOptions = data.map((company) => {
          return { name: company.symbol, sector: company.sector }
        })

        apiCall.submitEntity({ form_id: formId, business_date: businessDate }, '/companies/today_price')
          .then((response) => {
            const { data: todayPrice } = response;

            apiCall.fetchEntities('/companies/sector_summary', { business_date: businessDate })
              .then((response) => {
                const { data: sectorWise } = response;
                const formattedData = {
                  name: 'Floorsheet',
                  children: sectorWise.map((sector) => {
                    return {
                      name: sector.sectorName,
                      children: symbolOptions.filter((sym) => sym.sector === sector.sectorName.replace(' ', '_').toLowerCase()).map((symbol) => {
                        return {
                          name: symbol.name,
                          value: (todayPrice.find((s) => s.symbol === symbol.name) || {}).totalTradedQuantity
                        }
                      })
                    }
                  })
                }
                setData(formattedData)
              }).catch(() => {});

          }).catch(() => {});

      }).catch(() => {});
  }

  const handleBusinessDate = (event) => {
    setBusinessDate(event.target.value)
  }

  return (
    <Container className="mt--9 mb-5" fluid>
      <Row>
        <Col md={3}>
          <Input type="text" onChange={(event) => setFormId(event.target.value) } />
        </Col>
        <Col md={3}>
          <Input type="date" onChange={handleBusinessDate} />
        </Col>
      </Row>
      <br />
      <Row className="text-center d-block mt-9">
        <Chart data={data} />
      </Row>
    </Container>
  )
}