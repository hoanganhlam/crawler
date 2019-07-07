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
const SCRIPT_1 = [{
        key: '1',
        title: "Đến trang chủ",
        action: "GOTO",
        target: "https://vnexpress.net/",
    },
    {
        key: '2',
        title: "Đến danh mục du lịch",
        action: "CLICK",
        target: "#main_menu > a.mnu_dulich",
    },
    {
        key: '3',
        title: "Lấy hết các phân trang",
        target: ".next",
        loop: "PAGING",
        children: [{
            key: '31',
            title: "Bóc tách dữ liệu",
            action: "EXTRACT",
            target: "#col_sticky > article",
            fields: [{
                    field: 'title',
                    attr: 'innerHTML',
                    path: 'a',

                },
                {
                    field: 'url',
                    attr: 'href',
                    path: 'a',

                },
                {
                    field: 'description',
                    attr: 'innerHTML',
                    path: '.description',

                }
            ]
        }]
    }
]

// Lấy tất cả nội dung có liên quan đến Sơn Tùng MTP

const
    SCRIPT_2 = [{
        isLoop: true,
        stopCondition: "",
        loopModel: "",
        scrollDown: false,
        children: [{
                action: "GOTO",
                target: "https://vnexpress.net/",
            },
            {
                action: "INPUT",
                target: ".mnu_dulich",
                text: "Sơn tùng"
            },
            {
                action: "CLICK",
                target: "#search button"
            },
            {
                isLoop: true,
                children: [{
                    action: "EXTRACT",
                    field: {
                        'title': {
                            path: '.title_news',
                        },
                        'url': {
                            path: '.title_news a',
                        },
                        'description': '.description'
                    },
                }]
            }
        ]
    }]