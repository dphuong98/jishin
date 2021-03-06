import "antd/dist/antd.css";
import "../App.css";
import { Layout, Table, Button, Dropdown, Menu, message, Col, Row } from "antd";
import { Component } from "react";
import MapTemp from "./MapTemp";
import axios from "axios";
import SearchField from "react-search-field";
import { DownOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { getDistance, getDistrict, getCity, getAddress } from "../component/ForGetTable/getData";
import PageHeader from '../component/PageHeader/PageHeader';

const { Content, Footer } = Layout;

class ShelterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shelters: [],
      pagination: {
        current: 1,
        pageSize: 3,
      },
      loading: false,
    };
  }

  componentDidMount() {
    axios
      .get(`https://5fa8a7c7c9b4e90016e697f4.mockapi.io/api/jishin/shelter`)
      .then((res) => {
        const shelters = res.data.map((obj) => ({
          id: obj.id,
          name: obj.name,
          place: getAddress(obj.place),
          coord_lat: obj.coord_lat,
          coord_lng: obj.coord_lng,
          district: getDistrict(obj.place),
          city: getCity(obj.place),
          distance: getDistance(
            obj.coord_lat,
            obj.coord_lng,
            this.props.user_location.lat,
            this.props.user_location.lng
          ).toFixed(4),
        }));
        this.setState({ shelters });
      });
  }

  handleTableChange = (pagination) => {
    this.setState({
      pagination: {
        ...pagination,
      },
    });
  };

  handleChangeMap = () => {
    this.setState({
      config_center: {
        lat: 23,
        lng: 105,
      },
    });
  };

  handleCenterLocation = (x, y) => {
    this.setState({
      config_center: {
        lat: x,
        lng: y,
      },
    });
  }

  onChange = (value, event) => {
    axios
      .get(`https://5fa8a7c7c9b4e90016e697f4.mockapi.io/api/jishin/shelter`)
      .then((res) => {
        const shelters = res.data.filter(shelter => shelter.name.toLowerCase().includes(value.toLowerCase())).map((obj) => ({
          id: obj.id,
          name: obj.name,
          place: getAddress(obj.place),
          coord_lat: obj.coord_lat,
          coord_lng: obj.coord_lng,
          district: getDistrict(obj.place),
          city: getCity(obj.place),
          distance: getDistance(
            obj.coord_lat,
            obj.coord_lng,
            this.props.user_location.lat,
            this.props.user_location.lng
          ).toFixed(4),
        }));
        this.setState({ shelters });
      });
  }
  onChangeCity = (event) => {
    axios
      .get(`https://5fa8a7c7c9b4e90016e697f4.mockapi.io/api/jishin/shelter`)
      .then((res) => {
        const shelters = res.data.filter(shelter => shelter.place.toLowerCase().includes(event.key.toLowerCase())).map((obj) => ({
          id: obj.id,
          name: obj.name,
          place: getAddress(obj.place),
          coord_lat: obj.coord_lat,
          coord_lng: obj.coord_lng,
          district: getDistrict(obj.place),
          city: getCity(obj.place),
          distance: getDistance(
            obj.coord_lat,
            obj.coord_lng,
            this.props.user_location.lat,
            this.props.user_location.lng
          ).toFixed(4),
        }));
        this.setState({ shelters });
      });
    message.info(event.key);
  }

  selectRow = (record) => {
    this.handleCenterLocation(record.coord_lat, record.coord_lng);
    // window.location.href = "#";
  }

  render() {
    const { shelters, pagination, loading } = this.state;
    const columns = [
      {
        title: <div style={{fontSize: 25}}>場所の名前</div>,
        dataIndex: "name",
        key: "shelter_name",
        render: text => (<div><Link to={`/shelter/` + (shelters.find(x => x.name === text).id - 1).toString()}>{text}</Link></div>),
      },
      {
        title: <div style={{fontSize: 25}}>場所</div>,
        dataIndex: "place",
        key: "shelter_place",
      },
      {
        title: <div style={{fontSize: 25}}>地区</div>,
        dataIndex: "district",
        key: "district",
      },
      {
        title: <div style={{fontSize: 25}}>都市</div>,
        dataIndex: "city",
        key: "city",
      },
      {
        title: <div style={{fontSize: 25}}>距離 ( m )</div>,
        dataIndex: "distance",
        defaultSortOrder: 'ascend',
        key: "distance",
        sorter: {
          compare: (a, b) => a.distance - b.distance,
          multiple: 1,
        },
      },
    ];

    const menu = (
      <Menu onClick={this.onChangeCity} >
        <Menu.Item key="Hà Nội" >
          Hà Nội
        </Menu.Item>
        <Menu.Item key="Bắc Ninh" >
          Bắc Ninh
        </Menu.Item>
        <Menu.Item key="Hải Phòng">
          Hải Phòng
        </Menu.Item>
      </Menu>
    );
    return (
      <div style={{ background: "#FFFFFF" }}>
        <PageHeader title="避難所情報" />
        <Content style={{ margin: "24px 16px 0", minHeight: "800px" }}>
          <div>
            <MapTemp
              pagename={this.props.pagename}
              center={this.props.user_location}
              user_location={this.props.user_location}
              data={shelters}
            />
          </div>
        </Content>
        <Col >
          <Row >
            <Col span={16}>
              <SearchField
                placeholder="検索..."
                onChange={this.onChange}
                onClick={this.onChange}
                classNames="shelter-search"
              />
            </Col>
            <Col span={8}>
              <Dropdown overlay={menu}>
                <Button style={{background: "pink", color: "black" , borderColor:"pink"}} block>
                都市で検索 <DownOutlined />
                </Button>
              </Dropdown>
            </Col>

          </Row>

            <Table
              columns={columns}
              dataSource={shelters}
              pagination={pagination}
              loading={loading}
              onChange={this.handleTableChange}
              onRow={(record) => ({
                onClick: () => {
                  this.selectRow(record);
                },
              })
              } 
            />

        </Col>
        <Footer style={{ textAlign: "center", background: "#FFFFFF" }}>開発チーム・花火</Footer>
      </div>
      // </Layout>
    );
  }
}
export default ShelterPage;
