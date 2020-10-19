import { Card, Col, Divider, Row, Typography, Image, Upload, Input } from "antd";
import ImgCrop from "antd-img-crop";
import React, { useState } from "react";
import Modal from "antd/lib/modal/Modal";

const { Title } = Typography;

const product ={
    name :"Iphone 9",
    unit:"Unit",
    category:"Mobile",
    details:(<div>Mã Quốc Tế: LL/ZA/ZP/Mới 100%, chưa active<br/>Thiết kế: Nguyên khối<br/>Màn hình OLED: 6.5 inch Super Retina (2688 x 1242), 458ppi, 3D Touch, TrueTone Dolby Vision HDR 10<br/>Camera Trước/Sau: 7MP/ 2 camera 12MP<br/>CPU: A12 Bionic 64-bit 7nm<br/>Bộ Nhớ: 64GB<br/>RAM: 4GB<br/>SIM: 1 Nano SIM<br/>Đạt chuẩn chống nước bụi IP68, Face ID</div>)
}

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
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

const AdminBiddingDetailsComponent = ({ bidding }) => {
    const [fileList, setFileList] = useState([]);
    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };
    const [imgSource, setImgSource] = useState("https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png");

    const onPreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        console.log(file.preview);
        setImgSource(file.preview);
    };
    return (
        <div>
            <Row justify="space-between" align="middle">
                <Title level={3}>Product Detail</Title>
            </Row>
            <Row>
                <Col span={6}>
                    <Row>
                        <Image
                            width={200}
                            src={imgSource}
                        />
                    </Row>
                    <Row>
                        <ImgCrop rotate>
                            <Upload
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                listType="picture-card"
                                fileList={fileList}
                                onChange={onChange}
                                onPreview={onPreview}
                            >
                                {fileList.length < 5 && "+ Upload"}
                            </Upload>
                        </ImgCrop>
                    </Row>
                </Col>
                <Col span={18}>
                    <Row justify="space-between" align="middle">
                        <Title level={4}>Iphone 8x</Title>
                        <DescriptionItem
                            title="Product Category"
                            content={product.category}
                        />
                        <DescriptionItem
                            title="Product Unit"
                            content={product.unit}
                        />
                        <DescriptionItem
                            title="Product Description"
                            content={product.details}
                        />
                    </Row>
                </Col>
            </Row>
        </div>);
}
export default AdminBiddingDetailsComponent;