import {WrapperCateName, WrapperContain} from "./Style";
import {Col, Row} from "antd";
import Caption from "../../components/Caption/Caption";
import {RSSFeed} from "../../service/rssService";
import {useLoaderData} from "react-router";
import Item from "../../components/Item";
import {NewsItem} from "../../components/NewsItem";
import {useEffect, useState} from "react";

export async function loadRss({params}: any) {
    let url = "";
    let cateName = "";
    switch (params.nameCate) {
        case "trang-chu":
            url = "https://dantri.com.vn/rss/home.rss";
            cateName = "Trang chủ";
            break;
        case "kinh-doanh":
            url = "https://dantri.com.vn/rss/kinh-doanh.rss";
            cateName = "Kinh doanh";
            break;
        case "xa-hoi":
            url = "https://dantri.com.vn/rss/xa-hoi.rss";
            cateName = "Xã hội";
            break;
        case "the-gioi":
            url = "https://dantri.com.vn/rss/the-gioi.rss";
            cateName = "Thế giới";
            break;
        case "giai-tri":
            url = "https://dantri.com.vn/rss/giai-tri.rss";
            cateName = "Giải trí";
            break;
        case "bat-dong-san":
            url = "https://dantri.com.vn/rss/bat-dong-san.rss";
            cateName = "Bất động sản";
            break;
        case "the-thao":
            url = "https://dantri.com.vn/rss/the-thao.rss";
            cateName = "Thể thao";
            break;
        default:
            return url;
    }
    const data = [];
    const feed = await RSSFeed(url);
    data.push(feed);
    data.push(cateName);
    return data;
}

function CategoryPage() {
    const data: any = useLoaderData();
    const feed = data[0];
    const nameCate = data[1];
    // Create a new DOM parser
    const parser = new DOMParser();
    let imageUrl: any = "";
    const doc = parser.parseFromString(feed[0].content, 'text/html');
    const imgElement = doc.querySelector('img');
    if (imgElement) {
        imageUrl = imgElement.getAttribute('src');
    }

    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);

        // Cleanup function to remove event listener when component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // Empty dependency array ensures that effect runs only once after mount

    const isSmallScreen = windowSize.width < 1200;
    return (
        <WrapperContain>
            <Row>
                <Col span={24}>
                    <WrapperCateName>{nameCate}</WrapperCateName>
                    {windowSize.width > 768 ? (
                        <div>
                            <Item title={feed[0].title} description={feed[0].contentSnippet} imageUrl={imageUrl} newsUrl={feed[0].link.replace("https://dantri.com.vn/", "")} style={{width:"100%", height: "100%"}} styleBody={{fontSize: "130%"}} col1={9} col2={15}/>
                        </div>
                    ) : (
                        <div style={{width: "90%", height: "auto", margin: " 20px auto"}}>
                            <NewsItem title={feed[0].title} description={feed[0].contentSnippet} imageUrl={imageUrl} newsUrl={feed[0].link.replace("https://dantri.com.vn/", "")}/>
                        </div>
                    )
                    }

                </Col>
            </Row>
            <Row>
                {isSmallScreen ?
                    feed.slice(1, 4).map((item: any, index: any) => {
                        let imageUrl: any = "";
                        const doc = parser.parseFromString(item.content, 'text/html');
                        const imgElement = doc.querySelector('img');
                        if (imgElement) {
                            imageUrl = imgElement.getAttribute('src');
                        }
                        return (
                            <Col xl={6} lg={8} md={8}key={index} style={{margin: "0 auto"}}>
                                {windowSize.width > 768 ? (
                                    <div style={{width: "90%", height: 300, margin: " 20px auto"}}>
                                        <NewsItem title={item.title} description={""} imageUrl={imageUrl} newsUrl={item.link.replace("https://dantri.com.vn/", "")}/>
                                    </div>
                                ) : (
                                    <div style={{marginBottom: "15px"}}>
                                        <Item title={item.title} description={""} imageUrl={imageUrl} newsUrl={item.link.replace("https://dantri.com.vn/", "")} style={{width:"100%", height: "100%"}} styleBody={""} col1={9} col2={15} />
                                    </div>
                                )
                                }
                            </Col>
                        );
                    }) :
                    feed.slice(1, 5).map((item: any, index: any) => {
                        let imageUrl: any = "";
                        const doc = parser.parseFromString(item.content, 'text/html');
                        const imgElement = doc.querySelector('img');
                        if (imgElement) {
                            imageUrl = imgElement.getAttribute('src');
                        }
                        return (
                            <Col xl={6} lg={8} md={8} key={index} style={{margin: "0 auto"}}>
                                <div style={{  width: "90%", height: 350 , margin: " 20px auto"}}>
                                    <NewsItem title={item.title} description={""} imageUrl={imageUrl} newsUrl={item.link.replace("https://dantri.com.vn/"+nameCate, "")}/>
                                </div>
                            </Col>
                        );
                    })
                }
            </Row>
            <Caption title="Mới nhất"/>
            <Row>
                {
                    isSmallScreen ? (
                        feed.slice(4).map((item: any, index: any) => {
                            let imageUrl: any = "";
                            const doc = parser.parseFromString(item.content, 'text/html');
                            const imgElement = doc.querySelector('img');
                            if (imgElement) {
                                imageUrl = imgElement.getAttribute('src');
                            }
                            return (
                                <Col span={24} key={index} style={{margin: "7.5px auto", marginBottom: "15px"}}>
                                    <div>
                                        {windowSize.width > 768 ? (
                                            <Item title={item.title} description={item.contentSnippet} imageUrl={imageUrl} newsUrl={item.link.replace("https://dantri.com.vn/", "")} style={{width:"100%", height: "100%"}} styleBody={""} col1={6} col2={18}/>
                                        ): (
                                            <Item title={item.title} description={item.contentSnippet} imageUrl={imageUrl} newsUrl={item.link.replace("https://dantri.com.vn/", "")} style={{width:"100%", height: "100%"}} styleBody={""} col1={9} col2={15}/>

                                        )}
                                    </div>
                                </Col>
                            );
                        })
                    ):(
                        feed.slice(5).map((item: any, index: any) => {
                            let imageUrl: any = "";
                            const doc = parser.parseFromString(item.content, 'text/html');
                            const imgElement = doc.querySelector('img');
                            if (imgElement) {
                                imageUrl = imgElement.getAttribute('src');
                            }
                            return (
                                <Col span={24} key={index} style={{margin: "7.5px auto", marginBottom: "15px"}}>
                                    <div>
                                        {windowSize.width > 768 ? (
                                            <Item title={item.title} description={item.contentSnippet} imageUrl={imageUrl} newsUrl={item.link.replace("https://dantri.com.vn/", "")} style={{width:"100%", height: "100%"}} styleBody={""} col1={6} col2={18}/>
                                        ): (
                                            <Item title={item.title} description={item.contentSnippet} imageUrl={imageUrl} newsUrl={item.link.replace("https://dantri.com.vn/", "")} style={{width:"100%", height: "100%"}} styleBody={""} col1={9} col2={15}/>

                                        )}
                                    </div>
                                </Col>
                            );
                        })
                    )

                }
            </Row>
        </WrapperContain>
    );
}

export default CategoryPage;