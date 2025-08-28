// Danh sách thành viên
const teamMembers = [
	{ name: "Nguyễn Quang Trường", role: "Giám đốc", img: "../member/Nguyen_Quang_Truong.png" },
	{ name: "Phạm Thanh Xuân", role: "Phó Giám đốc", img: "" },
	{ name: "Đào Thi Tố Nga", role: "Kế toán trưởng", img: "" },
	{ name: "Đỗ Thị Thơm", role: "Kế toán", img: "../member/Do_Thi_Thom.png" },
	{ name: "Nguyễn Hoài Nam", role: "Nhà nghiên cứu Di sản văn hóa", img: "../member/Nguyen_Hoai_Nam.png" },
	{ name: "Nguyễn Anh Dũng", role: "Cố vấn Di sản văn hóa", img: "../member/Nguyen_Anh_Dung.png" },
	{ name: "Lương Văn Tuyên", role: "Cán bộ vật tư", img: "../member/Luong_Van_Tuyen.png" },
	{ name: "Đinh Thanh Hải", role: "Kiến trúc sư", img: "" },
	{ name: "Nguyễn Thị Phương Dung", role: "Kiến trúc sư", img: "" },
	{ name: "Nguyễn Đức Quân", role: "Kiến trúc sư", img: "" },
	{ name: "Đinh Thị Hà Trang", role: "Kiến trúc sư", img: "../member/Dinh_Thi_Ha_Trang.png" },
	{ name: "Hà Minh Tiến", role: "Kỹ sư xây dựng cầu đường", img: "" },
	{ name: "Lê Đình Hiệu", role: "Kỹ sư xây dựng", img: "" },
	{ name: "Trần Văn Đạt", role: "Kỹ sư xây dựng", img: "" },
	{ name: "Phạm Phi Hùng", role: "Kỹ sư xây dựng", img: "" },
	{ name: "Đào Lê Minh", role: "Kỹ sư xây dựng", img: "" },
	{ name: "Phạm Ngọc Anh", role: "Kỹ sư xây dựng", img: "" },
	{ name: "Bùi Đức Điểm", role: "Kỹ sư xây dựng", img: "" },
	{ name: "Mai Quốc Hiệp", role: "Kỹ sư định giá", img: "" },
	{ name: "Vũ Thị Mai", role: "Kỹ sư kỹ thuật xây dựng", img: "" },
	{ name: "Vũ Việt Anh", role: "Kỹ sư xây dựng", img: "" },
	{ name: "Vũ Lộc Trường", role: "Kỹ Sư xây dựng", img: "../member/Vu_Loc_Truong.png" },
	{ name: "Nguyễn Phương Nam", role: "Kỹ sư kỹ thuật xây dựng", img: "" },
	{ name: "Trần Thị Hương", role: "Kỹ sư định giá", img: "" },
	{ name: "Lưu Anh Tuấn ", role: "Kỹ sư lâm nghiệp", img: "../member/Luu_Anh_Tuan.png" },
	{ name: "Nguyễn Thị Mến", role: "Kỹ sư quản lý xây dựng", img: "" },
	{ name: "Bùi Đức Quân", role: "Kĩ sư kỹ thuật công trình", img: "" },
	{ name: "Khúc Thị Thu Thủy", role: "Kỹ sư xây dựng", img: "../member/Khuc_Thi_Thu_Thuy.png" },
	{ name: "Phùng Văn Hồ", role: "Kỹ sư xây dựng", img: "" },
	{ name: "Trần Ngọc Thành", role: "Kỹ sư cấp thoạt nước", img: "" },
	{ name: "Nguyễn Thị Thu Hà", role: "Kỹ sư kỹ thuật điện", img: "" },
	{ name: "Nguyễn Anh Hải ", role: "Kỹ sư hạ tầng", img: "" },
	{ name: "Lê Minh Phúc", role: "Nhân viên kỹ thuật", img: "" },
	{ name: "Vũ Lê Mạnh Cường", role: "Nhân viên kỹ thuật", img: "" },
	{ name: "Trần Văn Khiêm", role: "Nhân viên kỹ thuật", img: "" },
	{ name: "Nguyễn Quang Huy", role: "Nhân viên kỹ thuật", img: "" },
	{ name: "Phạm Quang Minh", role: "Nhân viên kỹ thuật", img: "" },
	{ name: "Dương Quang Huy", role: "Nhân viên kỹ thuật", img: ""}
];

const slider = document.getElementById('team-slider');
const btnPrev = document.getElementById('team-prev');
const btnNext = document.getElementById('team-next');
let currentIndex = 0;
const IMAGES_PER_PAGE = 5;

function renderSlider() {
	slider.innerHTML = '';
		for (let i = 0; i < IMAGES_PER_PAGE; i++) {
			const idx = (currentIndex + i) % teamMembers.length;
			const member = teamMembers[idx];
			const div = document.createElement('div');
				div.className = "flex flex-col items-center min-w-[300px] max-w-[340px]";
				div.innerHTML = `
					<img src="${member.img || '../logo/logo.png'}" alt="${member.name}" class="w-72 h-72 object-cover shadow-xl mb-6 rounded-2xl bg-gray-200">
					<h3 class="text-xl font-bold text-center">${member.name}</h3>
					<p class="text-orange-500 font-semibold text-center text-lg">${member.role}</p>
				`;
			slider.appendChild(div);
		}
}

btnPrev.addEventListener('click', () => {
	currentIndex = (currentIndex - IMAGES_PER_PAGE + teamMembers.length) % teamMembers.length;
	renderSlider();
});
btnNext.addEventListener('click', () => {
	currentIndex = (currentIndex + IMAGES_PER_PAGE) % teamMembers.length;
	renderSlider();
});

// Khởi tạo lần đầu
renderSlider();
