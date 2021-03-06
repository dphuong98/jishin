import "antd/dist/antd.css";
import "../App.css";
import { Link, withRouter } from "react-router-dom";
import { Layout, Table, Tag } from "antd";
import { Component } from "react";
import MapTemp from "./MapTemp";
import axios from "axios";
import PageHeader from '../component/PageHeader/PageHeader';
import { Button } from "antd"

const { Content, Footer } = Layout;
function changeDate(this_date) {
  var return_date = "";
  return_date =
    this_date.getHours().toString() +
    ":" +
    this_date.getMinutes().toString() +
    ":" +
    this_date.getSeconds().toString() +
    " " +
    this_date.getDate().toString() +
    "/" +
    this_date.getMonth().toString() +
    "/" +
    this_date.getFullYear().toString();

  return return_date;
}
class LogPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      pagination: {
        current: 1,
        pageSize: 3,
      },
      loading: false,
      isauthe: false,
    };
  }
  componentDidMount() {
    axios
      .get("https://5fa8a7c7c9b4e90016e697f4.mockapi.io/api/jishin/log")
      .then((res) => {
        const posts = res.data.map((obj) => {
          let timeLeft = "";
          const difference = obj.occure_time - Date.now() / 1000;
          if (difference > 0) {
            if (difference > 24 * 60 * 60)
              timeLeft = `${Math.floor(difference / 24 / 60 / 60)} days left`;
            else if (difference > 60 * 60)
              timeLeft = `${Math.floor(difference / 60 / 60)} hours left`;
            else if (difference > 60)
              timeLeft = `${Math.floor(difference / 60)} minutes left`;
            else timeLeft = `${difference} seconds left`;
          }
          return {
            id: obj.id,
            occure_time: `
            ${changeDate(new Date(obj.occure_time * 1000))} ${timeLeft ? "- " + timeLeft : ""
              }`,
            place: obj.place,
            strength: obj.strength,
            coord_lat: obj.coord_lat,
            coord_lng: obj.coord_long,
          };
        });
        this.setState({ posts });
      });
    var loggedInUser = localStorage.getItem('user');
    if (loggedInUser){
      this.setState({ isauthe: true });
    }
  }
  handleTableChange = (pagination) => {
    this.setState({ pagination });
  };
  render() {
    const { posts, pagination, loading } = this.state;
    const columns = [
      {
        title: <div style={{fontSize: 25}}>場所</div>, 
        dataIndex: "place",
        key: "jishin_place",
      },
      {
        title: <div style={{fontSize: 25}}>起きる時間</div>,
        dataIndex: "occure_time",
        key: "jishin_occure_time",
      },
      {
        title: <div style={{fontSize: 25}}>震度</div>,
        dataIndex: "strength",
        key: "strength",
        render: (text) => <Tag color="red">{text}</Tag>,
      },
      {
        title: ' ',
        key: 'action',
        dataIndex: 'place',
        render: text => {
          if (this.state.isauthe === true) {
            return (
              <div>
                <Button type="primary">
                  <Link to={
                    `/earth_quake/` +
                    (posts.find((x) => x.place === text).id - 1).toString()}>特別情報</Link>
                </Button>
              </div>
            );
          }
          else{
            return (<div></div>);
          }
        }


      }
    ];
    const jishin_data = posts;
    return (
      <Layout style={{ background: "#FFFFFF" }}>
        <PageHeader title="地震情報" />
        <Content style={{ margin: "24px 16px 0", minHeight: "800px" }}>
          <div>
            <MapTemp
              pagename={this.props.pagename}
              center={this.props.user_location}
              user_location={this.props.user_location}
              earthquake_data={jishin_data}
            />
          </div>
        </Content>
        <Table
          columns={columns}
          dataSource={jishin_data}
          pagination={pagination}
          loading={loading}
          onChange={this.handleTableChange}
        />
        <Footer style={{ textAlign: "center", background: "#FFFFFF" }}>
          開発チーム・花火
        </Footer>
      </Layout>
    );
  }
}

export default withRouter(LogPage);
