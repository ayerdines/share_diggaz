import React, {useContext, useEffect, useMemo, useState} from 'react';
import apiCall from "../../helpers/apiCall";
import { Button, Card, CardHeader, Col, Container, Input, Row } from "reactstrap";
import ReactTable from "../ReactTable";
import adminCanAccess from "../../helpers/Authorization";

export default function Index() {
  const [priceHistories, setPriceHistories] = useState([]);
  const [businessDates, setBusinessDates] = useState([]);
  const [sectorOptions, setSectorOptions] = useState([]);
  const [sector, setSector] = useState('commercial_banks');

  useEffect(() => {
    fetchPriceHistories();
  }, [sector])

  useEffect(() => {
    fetchSectorOptions();
  }, [])

  const fetchPriceHistories = () => {
    apiCall.fetchEntities('/price_histories.json', {sector: sector})
      .then((response) => {
        const { data, meta } = response.data;
        const prices = data.map((datum) => datum.attributes);
        const priceHistoriesData = groupByBusinessDate(prices);
        setBusinessDates(meta.last_3_business_dates);
        setPriceHistories(priceHistoriesData);
      }).catch(() => {});
  }

  const fetchSectorOptions = () => {
    apiCall.fetchEntities('/companies/sector_options.json')
      .then((response) => {
        const { data } = response;
        setSectorOptions(data);
      }).catch(() => {});
  }

  const groupByBusinessDate = (data) => {
    let groupedData = {};
    let formattedPrices = []
    data.map((row) => {
      groupedData[row.symbol] = data.filter((rowNew) => rowNew.symbol === row.symbol);
    })
    Object.entries(groupedData).forEach(([symbol, prices]) => {
      let formattedPrice = {}
      formattedPrice.symbol = symbol;
      prices.reverse().map((price, index) => {
        formattedPrice[`price_change_${index}`] = parseFloat(price.price_change) || 0
        formattedPrice[`volume_change_${index}`] = parseFloat(price.volume_change) || 0
        formattedPrice[`average_traded_price_${index}`] = parseFloat(price.average_traded_price) || 0
      })
      formattedPrice['average_price_change'] = (() => {
        return ((formattedPrice['price_change_0'] + formattedPrice['price_change_1'] + formattedPrice['price_change_2'])/3).toFixed(2)
      })();
      formattedPrice['average_volume_change'] = (() => {
        return ((formattedPrice['volume_change_0'] + formattedPrice['volume_change_1'] + formattedPrice['volume_change_2'])/3).toFixed(2)
      })();
      formattedPrice['average_traded_price'] = (() => {
        return ((formattedPrice['average_traded_price_0'] + formattedPrice['average_traded_price_1'] + formattedPrice['average_traded_price_2'])/3).toFixed(2)
      })();
      formattedPrices.push(formattedPrice);
    });
    return formattedPrices;
  }

  const dynamicColumns = () => {
    return businessDates.reverse().map((businessDate, index) => {
      let date = businessDate.business_date;
      return {
        Header: `Business Day (${date.split('T')[0]})`,
        columns: [
          {
            Header: 'Volume Change',
            accessor: `volume_change_${index}`,
            sortDescFirst: true
          },
          {
            Header: 'Price Change',
            accessor: `price_change_${index}`,
            sortDescFirst: true
          },
          // {
          //   Header: 'AP',
          //   accessor: `average_traded_price_${index}`,
          //   sortDescFirst: true
          // }
        ],
      }
    })
  }

  const toggleSector = (event) => {
    setSector(event.target.value);
  }

  const syncLastDay = () => {
    syncPriceHistories(true);
  }

  const syncAll = () => {
    syncPriceHistories();
  }

  const syncPriceHistories = (lastDay = false) => {
    apiCall.submitEntity({ sector: sector, last_day: lastDay },'/price_histories/sync.json')
      .then((response) => {
        alert('Sync Started');
      }).catch(() => {});
  }

  const data = useMemo(() => priceHistories, [priceHistories]);
  const columns = useMemo(
    () => [
      {
        Header: 'Symbol',
        accessor: 'symbol',
      },
      ...dynamicColumns(),
      {
        Header: 'Average',
        columns: [
          {
            Header: 'Volume Change',
            accessor: `average_volume_change`,
            sortDescFirst: true
          },
          {
            Header: 'Price Change',
            accessor: 'average_price_change',
            sortDescFirst: true
          },
          // {
          //   Header: 'AP',
          //   accessor: 'average_traded_price',
          //   sortDescFirst: true
          // }
          ],
      },
    ],
    [businessDates]
  )

  return (
    <>
      <Container className="mt--9" fluid>
        <Row>
          <Col md={3}>
            <Input type="select" bsSize="md" onChange={toggleSector}>
              { sectorOptions.map((sector, index) => <option key={String(index)} value={sector.value}>{sector.label}</option> )}
            </Input>
          </Col>
          <Col md={9}>
            { adminCanAccess() && (
              <>
                <Button color="primary" type="button" onClick={syncAll}>
                  Sync Sector Price Histories
                </Button>
                <Button color="primary" type="button" onClick={syncLastDay}>
                  Sync Last Trading Day
                </Button>
              </>
            )}
          </Col>
          <Col>
            <Row className="mt-5">
              <Col>
                <Card className="shadow">
                  <CardHeader className="border-0">
                    <h3 className="mb-0">Price Histories</h3>
                  </CardHeader>
                  <ReactTable columns={columns} data={data} />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}