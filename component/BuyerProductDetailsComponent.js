import { Card, Col, Divider, Row, Typography, Button } from "antd";
import React from "react";
import ImageGallery from 'react-image-gallery';

const { Title } = Typography;
const product = {
    name: "Iphone 9",
    unit: "Unit",
    category: "Mobile",
    details: (<div>Mã Quốc Tế: LL/ZA/ZP/Mới 100%, chưa active<br />Thiết kế: Nguyên khối<br />Màn hình OLED: 6.5 inch Super Retina (2688 x 1242), 458ppi, 3D Touch, TrueTone Dolby Vision HDR 10<br />Camera Trước/Sau: 7MP/ 2 camera 12MP<br />CPU: A12 Bionic 64-bit 7nm<br />Bộ Nhớ: 64GB<br />RAM: 4GB<br />SIM: 1 Nano SIM<br />Đạt chuẩn chống nước bụi IP68, Face ID</div>)
}
const images = [
    {
        original: '/static/images/iphone1.jpg',
        thumbnail: '/static/images/iphone1.jpg',
    },
    {
        original: '/static/images/iphone2.jpg',
        thumbnail: '/static/images/iphone2.jpg',
    },
    {
        original: '/static/images/iphone3.jpg',
        thumbnail: '/static/images/iphone3.jpg',
    },
    {
        original: '/static/images/iphone4.jpg',
        thumbnail: '/static/images/iphone4.jpg',
    },
    {
        original: '/static/images/iphone5.jpg',
        thumbnail: '/static/images/iphone5.jpg',
    },
    {
        original: '/static/images/iphone6.jpg',
        thumbnail: '/static/images/iphone6.jpg',
    }
];

const DescriptionItem = ({ title, content }) => (
    <Col span={24}>
        <Row className="site-description-item-profile-wrapper">
            <Col span={5}>
                <p className="site-description-item-profile-p-label">{title}:</p>
            </Col>
            <Col span={19}>
                <b>{content}</b>
            </Col>
        </Row>
    </Col>
);

const BuyerProductDetailsComponent = ({ props }) => {
    return (
        <div>
            <link
                rel="stylesheet"
                type="text/css"
                href="/static/assets/image-gallery.css"
            />
            <Row justify="space-between" align="middle">
                <Title level={3}>Product Detail</Title>
            </Row>
            <Row>
                <Col span={6}>
                    <ImageGallery items={images} showPlayButton={false} autoPlay={false} />
                </Col>
                <Col span={1} align="middle">
                    <Divider type="vertical" style={{ height: "78vh" }} />
                </Col>
                <Col span={14}>
                    <Row justify="space-between" align="middle">
                        <Title level={4}>Iphone 8x</Title>
                    </Row>
                    <DescriptionItem
                        title="Product Category"
                        content={product.category}
                    />
                    <DescriptionItem
                        title="Product Unit"
                        content={product.unit}
                    />
                    <Divider />
                    <b>{product.details}</b>
                </Col>
                <Col span={3}>
                    <Card>
                        <Button
                            onClick={() => {
                            }}
                            size="small"
                            type="primary"
                            style={{ width: "100%" }}>
                            Submit RFQ
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>);
}
export default BuyerProductDetailsComponent ;