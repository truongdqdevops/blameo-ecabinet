export const PHIEU_LAY_Y_KIEN = {
    DATA: [
        {
            type: 1,
            amount: 25
        },
        {
            type: 2,
            amount: 10
        },
        {
            type: 3,
            amount: 2
        }
    ],
    TYPE: {
        1: 'Đã trả lời: ',
        2: 'Sắp đến hạn trả lời: ',
        3: 'Quá hạn trả lời: '
    }
};

export const THONG_KE_CHUNG = {
    DATA: [
        {
            type: 1,
            amount: 3
        },
        {
            type: 2,
            amount: 7
        },
        {
            type: 3,
            amount: 12
        }
    ],
    TYPE: {
        1: 'Cuộc họp chưa cho ý kiến trước phiên họp',
        2: 'Cuộc họp chưa đăng ký phát biểu',
        3: 'Cuộc họp chưa xác nhận tham gia'
    }
};

export const LICH_HOP_GAN_NHAT = {
    DATA: [
        {
            title: 'Phiên họp Chính phủ thường kỳ Quý 2 năm 2019',
            status: 1,
            date: 'Hôm nay (20/09/2019)',
            timeStart: '8:00',
            timeEnd: '10:00',
            location: 'Phòng Họp tầng 2 - Toàn VPCP, Hoàng Hoa Thám, Ba Đình, Hà Nội',
            content: [
                {
                    scheme: 'Triển khai hạ tầng tại tuyến huyện',
                    chairScheme: 'Bộ Kế hoạch và Đầu tư'
                },
                {
                    scheme: 'Đưa E-Cabinet đến tất cả các huyện thuộc Thành phố Hà Nội',
                    chairScheme: 'Bộ Công thương'
                }
            ]
        },
        {
            title: 'Phiên họp Tổng kết tháng 7 năm 2019',
            status: 2,
            date: 'Ngày mai (21/09/2019)',
            timeStart: '9:00',
            timeEnd: '11:00',
            location: 'Phòng Họp tầng 2 - Toàn VPCP, Hoàng Hoa Thám, Ba Đình, Hà Nội',
            content: [
                {
                    scheme: 'Cải cách kì thi Tốt nghiệp THPT 2020',
                    chairScheme: 'Bộ Giáo dục'
                },
                {
                    scheme: 'Đưa vào sử dụng tuyến đường sắt trên cao Cát Linh - Hà Đông',
                    chairScheme: 'Bộ Giao thông'
                }
            ]
        },
        {
            title: 'Phiên họp Chính phủ thường kỳ Quý 2 năm 2019',
            status: 4,
            date: 'Ngày mai (21/09/2019)',
            timeStart: '9:00',
            timeEnd: '11:00',
            location: 'Phòng Họp tầng 2 - Toàn VPCP, Hoàng Hoa Thám, Ba Đình, Hà Nội',
            content: [
                {
                    scheme: 'Bảo vệ Biển Đông',
                    chairScheme: 'Bộ Quốc phòng'
                },
                {
                    scheme: 'Đầu tư cơ sở hạ tầng cho nông dân nuôi trồng thuỷ sản vùng ĐB Sông Cửu Long',
                    chairScheme: 'Bộ Kinh tế'
                }
            ]
        }
    ],
    STATUS: {
        1: {
            text: 'Đang họp',
            color: '#fba500'
        },
        2: {
            text: 'Có tham gia',
            color: '#aaaaaa'
        },
        3: {
            text: 'Không tham gia',
            color: '#aaaaaa'
        },
        4: {
            text: 'Chưa xác nhận',
            color: '#e34141'
        }
    }
};

export const DANH_SACH_Y_KIEN = {
    DATA: [
        {
            title: 'Về dự án Pháp lệnh sửa đổi, bổ sung các pháp lệnh có quy định liên quan đến quy hoạch',
            status: 1,
            dayStart: '15/10/2018',
            dayEnd: 'Hôm nay (30/10/2018)',
            timeStart: '9:00',
            timeEnd: '11:00',
            publish: 'Vụ khoa giáo văn xã - Văn phòng Chính phủ',
            signer: 'Thủ tướng Chính phủ Nguyễn Xuân Phúc',
            content: [
                {
                    creator: 'Ngô Xuân Lịch',
                    activity: 'Gửi phiếu đến Nguyễn Ngọc Linh',
                    conten: 'Nghiên cứu trả lời phiếu xin ý kiến này',
                    date: '16/10/2018'
                },
                {
                    creator: 'Nguyễn Ngọc Linh',
                    activity: 'Trả lời',
                    conten: 'Kính gửi thứ trưởng',
                    date: '18/10/2018'
                },
                {
                    creator: 'Phùng Xuân Nhạ',
                    activity: 'Phê duyệt văn bản trả lời',
                    conten: 'Đã phê duyệt công văn',
                    date: '20/10/2018'
                },
                {
                    creator: 'Nguyễn Xuân Phúc',
                    activity: 'Công khai văn bản trả lời trước Quốc hội',
                    conten: 'Thưa các đại biểu',
                    date: '22/10/2018'
                }
            ]
        },
        {
            title: 'Về dự án Luật sửa đổi bổ sung một số điều của Luật đầu tư công',
            status: 1,
            dayStart: '15/07/2018',
            dayEnd: 'Ngày mai (15/08/2018)',
            timeStart: '9:00',
            timeEnd: '11:00',
            publish: 'Vụ luật nội vụ',
            signer: 'Chủ tịch nước Nguyễn Phú Trọng',
            content: [
                {
                    creator: 'Ngô Xuân Lịch',
                    activity: 'Gửi phiếu đến Nguyễn Ngọc Linh',
                    conten: 'Nghiên cứu trả lời phiếu xin ý kiến này',
                    date: '16/10/2018'
                },
                {
                    creator: 'Nguyễn Ngọc Linh',
                    activity: 'Trả lời',
                    conten: 'Kính gửi thứ trưởng',
                    date: '18/10/2018'
                },
                {
                    creator: 'Phùng Xuân Nhạ',
                    activity: 'Phê duyệt văn bản trả lời',
                    conten: 'Đã phê duyệt công văn',
                    date: '20/10/2018'
                },
                {
                    creator: 'Nguyễn Xuân Phúc',
                    activity: 'Công khai văn bản trả lời trước Quốc hội',
                    conten: 'Thưa các đại biểu',
                    date: '22/10/2018'
                }
            ]
        },
        {
            title: 'Về dự án Luật sửa đổi, bổ sung một số điều của Luật thi hành án hình sự',
            status: 2,
            dayStart: '01/01/2018',
            dayEnd: 'Ngày kia (15/08/2018)',
            timeStart: '9:00',
            timeEnd: '11:00',
            publish: 'Vụ luật hình sự',
            signer: 'Đại Tướng Phùng Quang Thanh',
            content: [
                {
                    creator: 'Ngô Xuân Lịch',
                    activity: 'Gửi phiếu đến Nguyễn Ngọc Linh',
                    conten: 'Nghiên cứu trả lời phiếu xin ý kiến này',
                    date: '16/10/2018'
                },
                {
                    creator: 'Nguyễn Ngọc Linh',
                    activity: 'Trả lời',
                    conten: 'Kính gửi thứ trưởng',
                    date: '18/10/2018'
                },
                {
                    creator: 'Phùng Xuân Nhạ',
                    activity: 'Phê duyệt văn bản trả lời',
                    conten: 'Đã phê duyệt công văn',
                    date: '20/10/2018'
                },
                {
                    creator: 'Nguyễn Xuân Phúc',
                    activity: 'Công khai văn bản trả lời trước Quốc hội',
                    conten: 'Thưa các đại biểu',
                    date: '22/10/2018'
                }
            ]
        },
        {
            title: 'Về dự án Luật phòng, chống tác hại của rượu bia',
            status: 2,
            dayStart: '15/08/2018',
            dayEnd: 'Hôm qua (20/08/2018)',
            timeStart: '9:00',
            timeEnd: '11:00',
            publish: 'Bộ Giao thông vận tải',
            signer: 'Thủ tướng Chính phủ Nguyễn Xuân Phúc',
            content: [
                {
                    creator: 'Ngô Xuân Lịch',
                    activity: 'Gửi phiếu đến Nguyễn Ngọc Linh',
                    conten: 'Nghiên cứu trả lời phiếu xin ý kiến này',
                    date: '16/10/2018'
                },
                {
                    creator: 'Nguyễn Ngọc Linh',
                    activity: 'Trả lời',
                    conten: 'Kính gửi thứ trưởng',
                    date: '18/10/2018'
                },
                {
                    creator: 'Phùng Xuân Nhạ',
                    activity: 'Phê duyệt văn bản trả lời',
                    conten: 'Đã phê duyệt công văn',
                    date: '20/10/2018'
                },
                {
                    creator: 'Nguyễn Xuân Phúc',
                    activity: 'Công khai văn bản trả lời trước Quốc hội',
                    conten: 'Thưa các đại biểu',
                    date: '22/10/2018'
                }
            ]
        },
        {
            title: 'Về dự án Luật đặc khu',
            status: 2,
            dayStart: '15/07/2018',
            dayEnd: 'Hôm qua (15/08/2018)',
            timeStart: '9:00',
            timeEnd: '11:00',
            publish: 'Bộ Quốc phòng',
            signer: 'Chủ tịch nước Nguyễn Phú Trọng',
            content: [
                {
                    creator: 'Ngô Xuân Lịch',
                    activity: 'Gửi phiếu đến Nguyễn Ngọc Linh',
                    conten: 'Nghiên cứu trả lời phiếu xin ý kiến này',
                    date: '16/10/2018'
                },
                {
                    creator: 'Nguyễn Ngọc Linh',
                    activity: 'Trả lời',
                    conten: 'Kính gửi thứ trưởng',
                    date: '18/10/2018'
                },
                {
                    creator: 'Phùng Xuân Nhạ',
                    activity: 'Phê duyệt văn bản trả lời',
                    conten: 'Đã phê duyệt công văn',
                    date: '20/10/2018'
                },
                {
                    creator: 'Nguyễn Xuân Phúc',
                    activity: 'Công khai văn bản trả lời trước Quốc hội',
                    conten: 'Thưa các đại biểu',
                    date: '22/10/2018'
                }
            ]
        }
    ],
    STATUS: {
        1: {
            text: 'Chưa trả lời',
            color: '#FF0000',
            id: 1
        },
        2: {
            text: 'Đã trả lời',
            color: '#5789D3',
            id: 2
        }
    }
};

export const DANH_SACH_THANH_VIEN_CHINH_PHU = {
    MEMBER: [
        {
            position: 'Thủ tướng Chính phủ',
            name: 'Nguyễn Xuân Phúc',
            feedbackForm: '12_Phieughiykien',
            dateSend: '28/10/2018'
        },
        {
            position: 'Phó Thủ tướng Chính phủ',
            name: 'Trương Hòa Bình',
            feedbackForm: '12_Phieughiykien',
            dateSend: '28/10/2018'
        },
        {
            position: 'Phó Thủ tướng Chính phủ - Bộ Trưởng Bộ Ngoại giao',
            name: 'Phạm Bình Minh',
            feedbackForm: '12_Phieughiykien',
            dateSend: '28/10/2018'
        },
        {
            position: 'Phó Thủ tướng Chính phủ',
            name: 'Vương Đình Huệ',
            feedbackForm: '12_Phieughiykien',
            dateSend: '28/10/2018'
        },
        {
            position: 'Phó Thủ tướng Chính phủ',
            name: 'Vũ Đức Đam',
            feedbackForm: '12_Phieughiykien',
            dateSend: '28/10/2018'
        },
        {
            position: 'Phó Thủ tướng Chính phủ',
            name: 'Trịnh Đình Dũng',
            feedbackForm: '12_Phieughiykien',
            dateSend: '28/10/2018'
        },
        {
            position: 'Bộ trưởng Bộ Quốc phòng',
            name: 'Ngô Xuân Lịch',
            feedbackForm: '12_Phieughiykien',
            dateSend: '28/10/2018'
        },
        {
            position: 'Chủ tịch Nước',
            name: 'Nguyễn Phú Trọng',
            feedbackForm: '12_Phieughiykien',
            dateSend: '28/10/2018'
        },
        {
            position: 'Chủ tịch Quốc hội',
            name: 'Nguyễn Thị Kim Ngân',
            feedbackForm: '12_Phieughiykien',
            dateSend: '28/10/2018'
        },
        {
            position: 'Bộ trưởng Bộ công an',
            name: 'Tô Lâm',
            feedbackForm: '12_Phieughiykien',
            dateSend: '28/10/2018'
        }
    ]
};

export const NOI_DUNG_VA_KET_QUA_1 = {
    RESULT: [
        {
            id: 1,
            content: 'Về sửa đổi, bổ sung một số điều của Pháp lệnh công nghiệp quốc phòng',
            amount: 6,
            voter: [
                {
                    position: 'Thủ tướng Chính phủ',
                    name: 'Nguyễn Xuân Phúc'
                },
                {
                    position: 'Phó Thủ tướng Chính phủ',
                    name: 'Trương Hòa Bình'
                },
                {
                    position: 'Phó Thủ tướng Chính phủ',
                    name: 'Phạm Bình Minh'
                },
                {
                    position: 'Phó Thủ tướng Chính phủ',
                    name: 'Vương Đình Huệ'
                },
                {
                    position: 'Phó Thủ tướng Chính phủ',
                    name: 'Vũ Đức Đam'
                },
                {
                    position: 'Phó Thủ tướng Chính phủ',
                    name: 'Trịnh Đình Dũng'
                }
            ]
        },
        {
            id: 2,
            content: 'Về sửa đổi, bổ sung một số điều của Pháp lệnh công nghiệp quốc phòng',
            amount: 3,
            voter: [
                {
                    position: 'Bộ trưởng Bộ tài chính',
                    name: 'Đinh Tiến Dũng'
                },
                {
                    position: 'Bộ trưởng Bộ nông nghiệp và Phát triển nông thôn',
                    name: 'Nguyễn Xuân Cường'
                },
                {
                    position: 'Bộ trưởng Bộ y tế',
                    name: 'Nguyễn Thị Kim Tiến'
                }
            ]
        }
    ],
    ID: {
        1: 'Phương án 1',
        2: 'Phương án 2'
    }
};

export const NOI_DUNG_VA_KET_QUA_2 = {
    RESULT: [
        {
            content: 'Về sửa đổi, bổ sung một số điều của Pháp lệnh công nghiệp quốc phòng',
            pa1: '6',
            pa2: '3',
            fileId: 1189,
            subjectId: 1864
        },
        {
            content: 'Về sửa đổi, bổ sung một số điều của Pháp lệnh quản lý thị trường',
            pa1: '6',
            pa2: '3',
            fileId: 1190,
            subjectId: 1865
        },
        {
            content: 'test abc',
            pa1: '6',
            pa2: '3',
            fileId: 1190,
            subjectId: 1866
        },
        {
            content: 'test 2',
            pa1: '6',
            pa2: '3',
            fileId: 1190,
            subjectId: 1867
        }
    ]
};

export const VAN_BAN_LUAT = {
    DOC: [
        {
            name:
                'Đề cương báo cáo số 2946/DC-TTKQH của Tổng thư ký Quốc hội kết quả kỳ họp thứ 7, Quốc hội khóa XIV (Bản chi tiết)',
            content:
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
            startDate: '10/04/2019'
        },
        {
            name: 'Công văn số 1140/TTTP-PCTN ngày 18/3/2019 hướng dẫn UBND các quận, huyện, thị xã báo cáo',
            content:
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
            startDate: '10/05/2019'
        },
        {
            name: 'Công văn số 1137/TTTP-PCTN ngày 18/3/2019 hướng dẫn UBND các Sở báo cáo',
            content:
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
            startDate: '10/06/2019'
        },
        {
            name:
                'Đề cương Báo cáo về việc kiểm tra nội bộ việc thực hiện các quy định pháp luật về công tác phòng chống tham nhũng tại đơn vị',
            content:
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
            startDate: '10/07/2019'
        },
        {
            name:
                'Công văn về việc triển khai quyết định số 45/2018/QĐ-TTg của Thủ tướng Chính phủ về quy định chế độ họp',
            content:
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
            startDate: '10/08/2019'
        }
    ]
};

export const DANH_SACH = {
    TVCP: [
        {
            position: 'Chủ tịch nước',
            name: 'Nguyễn Phú Trọng',
            joined: true,
            substitute: '',
            reason: ''
        },
        {
            position: 'Chủ tịch Quốc hội',
            name: 'Nguyễn Thị Kim Ngân',
            joined: true,
            substitute: '',
            reason: ''
        },
        {
            position: 'Thủ tướng Chính phủ',
            name: 'Nguyễn Xuân Phúc',
            joined: true,
            substitute: '',
            reason: ''
        },
        {
            position: 'Bộ trưởng Bộ Quốc Phòng',
            name: 'Ngô Xuân Lịch',
            joined: false,
            substitute: 'Thứ trưởng Bộ Quốc Phòng - Phan Văn Giang',
            reason: 'Đau bụng'
        }
    ],
    KHACH_MOI: [
        {
            workUnit: 'Công ty TNHH Rikkeisoft',
            position: 'Chủ tịch',
            name: 'Tạ Sơn Tùng'
        },
        {
            workUnit: 'Công ty TNHH Rikkeisoft',
            position: 'CEO',
            name: 'Phan Thế Dũng'
        },
        {
            workUnit: 'Công ty TNHH Rikkeisoft',
            position: 'COO',
            name: 'Hà Huy Luân'
        },
        {
            workUnit: 'Công ty TNHH Rikkeisoft',
            position: 'Giám đốc D5',
            name: 'Lê Vũ Trung Thành'
        }
    ],
    PHAT_BIEU: [
        {
            name: 'Nguyễn Đăng Quang',
            position: 'Phó chủ tịch UBND Thành phố'
        },
        {
            name: 'Hoàng Việt Cường',
            position: 'Trưởng ban QLDA Thành phố'
        }
    ],
    Y_KIEN: [
        {
            name: 'Nguyễn Đăng Quang',
            position: 'Phó chủ tịch UBND Thành phố',
            opine: 'Ngay lập tức triển khai trong quý IV 2019'
        },
        {
            name: 'Hoàng Việt Cường',
            position: 'Trưởng ban QLDA Thành phố',
            opine: 'Ngay lập tức triển khai trong quý IV 2019'
        }
    ],
    VAN_DE: {
        LIST: [
            {
                content:
                    'Thực hiện thoả thuận hợp tác giữa Bộ Kế hoạch và Đầu tư vào quý II năm 2019 trong việc triển khai hệ thống Ecabinet tuyến Huyện.',
                status: 1,
                result: [96, 7, 10]
            },
            {
                content:
                    'Thực hiện thoả thuận hợp tác giữa Bộ Kế hoạch và Đầu tư vào quý II năm 2019 trong việc triển khai hệ thống Ecabinet tuyến Huyện.',
                status: 2,
                result: [15, 5, 53]
            }
        ],
        TYPE_VOTE: {
            1: 'Đồng ý: ',
            2: 'Không đồng ý: ',
            3: 'Chưa trả lời: '
        },
        STATUS: {
            1: 'Đã biểu quyết',
            2: 'Chờ biểu quyết'
        }
    }
};

export const TAI_LIEU = {
    LIST: [
        {
            type: 1,
            name: 'Văn kiện chung'
        },
        {
            type: 2,
            name: 'Các dự án luật, nghị quyết trình quốc hội thông qua'
        },
        {
            type: 3,
            name: 'Các dự án luật, nghị quyết trình quốc hội cho ý kiến'
        },
        {
            type: 4,
            name: 'Tài liệu chất vấn'
        },
        {
            type: 5,
            name: 'Báo cáo giám sát'
        },
        {
            type: 6,
            name: 'Báo cáo công tác'
        },
        {
            type: 7,
            name: 'Các luật, nghị quyết được quốc hội thông qua tại kì họp'
        },
        {
            type: 8,
            name: 'Tài liệu tham khảo'
        },
        {
            type: 9,
            name: 'Phiếu xin ý kiến'
        }
    ],
    DETAIL: {
        DATA: [
            {
                type: 1,
                name: 'Báo cáo số 229/BC-CP của Chính phủ về tình hình điều hành giá điện, xăng dầu'
            },
            {
                type: 1,
                name: 'Kinh tế xã hội - Ngân sách nhà nước'
            },
            {
                type: 1,
                name: 'Báo cáo tổng hợp kết quả kiểm toán'
            },
            {
                type: 1,
                name: 'Phân bổ dự phòng Kế hoạch Đầu tư công trung hạn 2016-2020'
            },
            {
                type: 2,
                name:
                    'Đề cương báo cáo số 2946/ĐC-TTKQH của Tổng thư ký Quốc hội kết quả kỳ họp thứ 7, Quốc hội khoá XIV (Bản tóm tắt)'
            },
            {
                type: 2,
                name:
                    'Đề cương báo cáo số 2946/ĐC-TTKQH của Tổng thư ký Quốc hội kết quả kỳ họp thứ 7, Quốc hội khoá XIV (Bản chi tiết)'
            },
            {
                type: 2,
                name: 'Phát biểu của Chủ tịch Quốc hội Nguyễn Thị Kim Ngân bế mạc kỳ họp thứ 7, Quốc hội khoá XIV'
            },
            {
                type: 2,
                name:
                    'Báo cáo số 26/BC-TA của Chánh án Toà án nhân dân tối cao về công tác của các Toà án tại kỳ họp thứ 7 Quốc hội khoá XIV'
            }
        ],
        TYPE: {
            1: 'folder',
            2: 'file'
        }
    }
};
export default null;
