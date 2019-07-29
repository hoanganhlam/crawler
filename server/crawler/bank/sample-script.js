/**
 * SCRIPT_1
 * Trong mỗi kịch bản sẽ có các trường sau:
 *      isLoop: Có lặp lại hay không
 *      stopCondition: Điều kiện để dừng vòng lặp
 *      loopModel: Các kiểu lặp: Danh sách nhập vào, lặp từ selector ví dụ như scroll, hoặc click vào next_page
 *      scrollDown: Kéo chuột xuống để lấy data từ ajax lazyload
 *      action: Tên của hành động này
 *      target: Hướng đến của hành động action: {là selector nào
 *      text: Nội dung nhập vào nếu action là INPUT hoặc TYPE
 *      children: Các bước con (đệ quy vào sâu)
 *      field: Dùng cho action EXTRACT để tách dữ liệu:
 *          path: Mỗi một field sẽ lấy theo path là selector chứa data
 *          regex: lấy data theo mẫu
 *          position: vị trí của data trong path {on hoặc in hoặc từ attribute}
 *          attr: nếu có position = attr
 */


// Lấy tất cả bài viết thuộc danh mục Du Lịch - VNExpress
const SCRIPT_1 = [
    {
        "key": "loop",
        "title": "Step 1",
        "action": "GOTO",
        "loop": "PAGING",
        "fields": [],
        "urls": [],
        "options": {
            "stop": false,
            "maxPage": "3",
            "loopTarget": "#pagination .next",
            "actionTarget": "https://vnexpress.net/du-lich",
            "actionSource": "http",
            "field": null,
            "loopKey": "",
            "params": [],
            "extractKey": null
        },
        "children": [
            {
                "key": "extract",
                "title": "Step 2",
                "action": "EXTRACT",
                "loop": null,
                "fields": [
                    {
                        "key": "url",
                        "attr": "href",
                        "path": "h4.title_news > a:nth-child(1)"
                    },
                    {
                        "key": "title",
                        "attr": "innerHTML",
                        "path": ".title_news"
                    },
                    {
                        "key": "short",
                        "attr": "innerHTML",
                        "path": ".description"
                    }
                ],
                "urls": [],
                "options": {
                    "stop": false,
                    "maxPage": 0,
                    "loopTarget": null,
                    "actionTarget": ".sidebar_1 .list_news",
                    "actionSource": "http",
                    "field": null,
                    "loopKey": null,
                    "params": [],
                    "extractKey": "loop"
                },
                "stop": true
            }
        ]
    }
]

const S2 = [
    {
        "key": "goto",
        "title": "Step 1",
        "action": "GOTO",
        "loop": null,
        "fields": [],
        "urls": [],
        "options": {
            "stop": false,
            "maxPage": 0,
            "loopTarget": null,
            "actionTarget": "https://www.factretriever.com/food-facts",
            "actionSource": "http",
            "field": null,
            "loopKey": null,
            "params": [],
            "extractKey": null
        },
        "children": []
    },
    {
        "key": "2",
        "title": "Step 2",
        "action": "EXTRACT",
        "loop": null,
        "fields": [
            {
                "key": "url",
                "attr": "href",
                "path": ".recentNewsDetail .recentNewsTitle",
                "append": "https://www.factretriever.com"
            }
        ],
        "urls": [],
        "options": {
            "stop": false,
            "maxPage": 0,
            "loopTarget": null,
            "actionTarget": ".recentNewsBox",
            "actionSource": "http",
            "field": null,
            "loopKey": null,
            "params": [],
            "extractKey": "goto"
        },
        "children": [
            {
                "key": "goto2",
                "title": "Step 2.1",
                "action": "GOTO",
                "loop": null,
                "fields": [],
                "urls": [],
                "options": {
                    "stop": false,
                    "maxPage": 0,
                    "loopTarget": null,
                    "actionTarget": "url",
                    "actionSource": "parent",
                    "field": null,
                    "loopKey": null,
                    "params": [],
                    "extractKey": null
                }
            },
            {
                "key": "2.2",
                "title": "Step 2.2",
                "action": "EXTRACT",
                "loop": null,
                "fields": [
                    {
                        "key": "facts",
                        "attr": "innerHTML",
                        "path": ".factsList li",
                        "append": ""
                    }
                ],
                "urls": [],
                "options": {
                    "stop": false,
                    "maxPage": 0,
                    "loopTarget": null,
                    "actionTarget": "html",
                    "actionSource": "http",
                    "field": null,
                    "loopKey": null,
                    "params": [],
                    "extractKey": "goto2"
                },
                "stop": true
            }
        ]
    }
]

const S3 = [
    {
        "key": "start",
        "title": "Step 1",
        "action": "GOTO",
        "loop": null,
        "target": "https://www.booking.com/",
        "fields": [],
        "urls": [],
        "field": null,
        "stop": false,
        "options": {
            "params": [],
            "actionTarget": "https://www.booking.com/"
        }
    },
    {
        "key": "2",
        "title": "Step 2",
        "action": "INPUT",
        "loop": null,
        "target": "input#ss",
        "fields": [],
        "urls": [],
        "field": null,
        "stop": false,
        "text": "Ha Noi",
        "options": {
            "params": [],
            "actionTarget": "input#ss",
            "extractKey": "start"
        }
    },
    {
        "key": "4",
        "title": "Step 4",
        "action": "CLICK",
        "loop": null,
        "target": "#frm > div.xp__fieldset.accommodation > div.xp__dates.xp__group > div.xp__dates-inner > div:nth-child(2) > div > div > div > div > span",
        "fields": [],
        "urls": [],
        "field": null,
        "stop": false,
        "options": {
            "params": [],
            "actionTarget": "#frm > div.xp__fieldset.accommodation > div.xp__dates.xp__group > div.xp__dates-inner > div:nth-child(2) > div > div > div > div > span",
            "extractKey": "start"
        }
    },
    {
        "key": "5",
        "title": "Step 5",
        "action": "CLICK",
        "loop": null,
        "fields": [],
        "urls": [],
        "field": null,
        "stop": false,
        "options": {
            "params": [],
            "actionTarget": "#frm > div.xp__fieldset.accommodation > div.xp__dates.xp__group > div.xp-calendar > div > div > div.bui-calendar__content > div:nth-child(1) > table > tbody > tr:nth-child(6) > td:nth-child(1)",
            "extractKey": "start"
        }
    },
    {
        "key": "6",
        "title": "Step 6",
        "action": "CLICK",
        "loop": null,
        "fields": [],
        "urls": [],
        "field": null,
        "stop": false,
        "options": {
            "params": [],
            "actionTarget": "#frm > div.xp__fieldset.accommodation > div.xp__dates.xp__group > div.xp-calendar > div > div > div.bui-calendar__content > div:nth-child(1) > table > tbody > tr:nth-child(6) > td:nth-child(2)",
            "extractKey": "start"
        }
    },
    {
        "key": "3",
        "title": "Step 3",
        "action": "CLICK",
        "loop": null,
        "target": "#frm > div.xp__fieldset.accommodation > div.xp__button > div.sb-searchbox-submit-col.-submit-button > button",
        "fields": [],
        "urls": [],
        "field": null,
        "stop": false,
        "options": {
            "params": [],
            "actionTarget": "#frm > div.xp__fieldset.accommodation > div.xp__button > div.sb-searchbox-submit-col.-submit-button > button",
            "extractKey": "start"
        }
    },
    {
        "key": "loop",
        "title": "Step 8",
        "action": "CLICK",
        "loop": "PAGING",
        "target": ".bui-pagination__next-arrow",
        "fields": [],
        "urls": [],
        "field": null,
        "stop": false,
        "children": [
            {
                "key": "7",
                "title": "Step 7",
                "action": "EXTRACT",
                "loop": null,
                "target": "div.sr_property_block[data-hotelid]",
                "fields": [
                    {
                        "key": "title",
                        "attr": "innerHTML",
                        "path": ".sr-hotel__name"
                    },
                    {
                        "key": "url",
                        "attr": "href",
                        "path": "a.hotel_name_link"
                    }
                ],
                "urls": [],
                "field": null,
                "stop": true,
                "options": {
                    "params": [],
                    "actionTarget": "div.sr_property_block[data-hotelid]",
                    "extractKey": "loop"
                }
            }
        ],
        "maxPage": "9",
        "options": {
            "params": [],
            "loopTarget": ".bui-pagination__next-arrow a",
            "extractKey": "start"
        }
    }
]

const S4 = [
    {
        "key": "loop",
        "title": "Lặp danh sách URL",
        "action": "GOTO",
        "loop": "ARRAY",
        "target": null,
        "fields": [],
        "children": [
            {
                "key": "2",
                "title": "Step 2",
                "action": "EXTRACT",
                "loop": null,
                "target": "body > section > section.sidebar_1 > article",
                "fields": [
                    {
                        "key": "title",
                        "path": ".title_news a",
                        "attr": "title"
                    },
                    {
                        "key": "url",
                        "path": ".icon_commend",
                        "attr": "href"
                    },
                    {
                        "key": "short",
                        "path": ".description",
                        "attr": "innerHTML"
                    }
                ],
                "stop": true,
                "start": true,
                "field": "",
                "options": {
                    "params": [],
                    "actionTarget": "body > section > section.sidebar_1 > article",
                    "extractKey": "loop"
                }
            }
        ],
        "urls": [
            "https://vnexpress.net/giai-tri/p1",
            "https://vnexpress.net/giai-tri/p2",
            "https://vnexpress.net/giai-tri/p3",
            "https://vnexpress.net/giai-tri/p4"
        ],
        "options": {
            "params": []
        }
    }
]

const S5 = [
    {
        "key": "1",
        "title": "Step 1",
        "action": "GOTO",
        "loop": "PAGING",
        "fields": [],
        "urls": [],
        "field": null,
        "stop": false,
        "options": {
            "params": [
                {
                    "key": "key",
                    "value": "AIzaSyC1Oag_e1x8FECR7ESzNouS7kUENzKHE2s"
                },
                {
                    "key": "language",
                    "value": "vi"
                },
                {
                    "key": "query",
                    "value": "restaurant in cau giay"
                }
            ],
            "loopTarget": "data.next_page_token",
            "maxPage": "5",
            "loopKey": "pagetoken",
            "actionTarget": "https://maps.googleapis.com/maps/api/place/textsearch/json"
        },
        "children": [
            {
                "key": "2",
                "title": "Step 2",
                "action": "EXTRACT",
                "loop": null,
                "target": "res.data.results",
                "fields": [
                    {
                        "key": "icon",
                        "attr": "innerHTML",
                        "path": "icon"
                    },
                    {
                        "key": "name",
                        "attr": "innerHTML",
                        "path": "name"
                    },
                    {
                        "key": "geometry",
                        "attr": "innerHTML",
                        "path": "geometry.location"
                    },
                    {
                        "key": "vicinity",
                        "attr": "innerHTML",
                        "path": "vicinity"
                    },
                    {
                        "key": "types",
                        "attr": "innerHTML",
                        "path": "types"
                    },
                    {
                        "key": "photos",
                        "attr": "innerHTML",
                        "path": "photos"
                    },
                    {
                        "key": "url",
                        "attr": "innerHTML",
                        "path": "place_id"
                    }
                ],
                "urls": [],
                "field": null,
                "stop": true,
                "options": {
                    "params": [],
                    "actionTarget": "data.results"
                }
            }
        ]
    }
]

const S6 = [
    {
        "key": "loop1",
        "title": "Step 1",
        "action": "GOTO",
        "loop": "PAGING",
        "fields": [],
        "urls": [],
        "options": {
            "stop": false,
            "maxPage": "3",
            "loopTarget": "#pagination .next",
            "actionTarget": "https://vnexpress.net/du-lich",
            "field": null,
            "loopKey": null,
            "params": [],
            "actionSource": "http"
        },
        "children": [
            {
                "key": "1.1",
                "title": "Step 1.1",
                "action": "EXTRACT",
                "loop": null,
                "fields": [
                    {
                        "key": "title",
                        "attr": "innerHTML",
                        "path": ".title_news"
                    },
                    {
                        "key": "short",
                        "attr": "innerHTML",
                        "path": ".description"
                    },
                    {
                        "key": "url",
                        "attr": "href",
                        "path": "h4.title_news > a:nth-child(1)"
                    }
                ],
                "urls": [],
                "options": {
                    "stop": false,
                    "maxPage": 0,
                    "loopTarget": null,
                    "actionTarget": ".sidebar_1 .list_news",
                    "field": null,
                    "loopKey": null,
                    "params": [],
                    "extractKey": "loop1"
                },
                "stop": false,
                "children": [
                    {
                        "key": "goto1",
                        "title": "Step 1.1.1",
                        "action": "GOTO",
                        "loop": null,
                        "fields": [],
                        "urls": [],
                        "options": {
                            "stop": false,
                            "maxPage": 0,
                            "loopTarget": null,
                            "actionTarget": "url",
                            "field": null,
                            "loopKey": null,
                            "params": [],
                            "actionSource": "parent"
                        }
                    },
                    {
                        "key": "1.1.2",
                        "title": "Step 1.12",
                        "action": "EXTRACT",
                        "loop": null,
                        "fields": [
                            {
                                "key": "content",
                                "attr": "innerHTML",
                                "path": ""
                            }
                        ],
                        "urls": [],
                        "options": {
                            "stop": false,
                            "maxPage": 0,
                            "loopTarget": null,
                            "actionTarget": "article.content_detail",
                            "field": null,
                            "loopKey": null,
                            "params": [],
                            "extractKey": "goto1"
                        },
                        "stop": true
                    }
                ]
            }
        ]
    }
]
