// localstorage'dagi ma'alumotlarni saqlovchi o'zgaruvchi
let info = JSON.parse(localStorage.getItem('info')) || [];

// Ma'lumotni edit yoki add qilishni belgilab beruvchi o'zgaruvchi
let foo = true;


// HTML elementlarini DOM'dan chaqirib olish
let tbody = document.querySelector('tbody'),
    newBtn = document.querySelector('#newBtn'),
    modal = document.querySelector('.modal'),
    exit = document.querySelector('#exit'),
    inputs = document.querySelectorAll('input'),
    addBtn = document.querySelector('#addBtn'),
    rasm = document.querySelector('.rasm'),
    statusVar = document.querySelector('#status');


// Barcha ma'lumotlarni render qilish funksiyasi
function render() {
    tbody.innerHTML = '';
    info = JSON.parse(localStorage.getItem('info')) || [];
    info.length > 0 ?
        info.map((item, index) => {
            tbody.innerHTML += `
            <tr>
                 <td>${index + 1}</td>
                <td id="rasmWrapper"><img src=${item.rasm} alt=${item.fName}${item.lName} /></td>
                <td>${item.fName}</td>
                <td>${item.lName}</td>
                <td>${item.guruh}</td>
                <td class="group-btn"><button onclick=edit(${index})><i class="fa-regular fa-pen-to-square"></i></button><button onclick=deleteFunc(${index})><i class="fa-solid fa-user-minus"></i></button></td>
            </tr>
        `
        }) : tbody.innerHTML = `<td id="oops" colspan="20"><h4>Hech qanday ma'lumot topilmadi!</h4></td>`
};

render();


// Modal oynani ochuvchi funksiya
function openModal() {
    modal.style.display = 'flex';
}

newBtn.addEventListener('click', () => {
    addBtn.innerText = 'Add';
    openModal()
});

// Modal oynanin yopuvchi funksiya
function closeModal() {
    modal.style.display = 'none';
    clear();
}

exit.addEventListener('click', closeModal);



// Inputdan kelgan ma'lumotlarni saqlab qoluvchi obyekt
let inputData = {};

// Inputdan ma'lumot olish
inputs.forEach(a => {
    a.addEventListener('input', (e) => {
        inputData = {
            ...inputData,
            [e.target.name]: e.target.value
        }
    })
});


// Rasm olish metodi
rasm.addEventListener('input', (e) => {
    inputData = {
        ...inputData,
        rasm: URL.createObjectURL(e.target.files[0])
    }
})

// Inputdagi eski ma'lumotlarni tozalash funksiyasi
let clear = () => {
    inputs.forEach(item => item.value = '')
};

// Yangi ma'lumotni massivga qo'shish funksiyasi 
addBtn.addEventListener('click', (e) => {
    if (inputs[0].value !== '' && inputs[1].value !== '' && inputs[2].value !== '') {
        // Yangi ma'lumot qo'shish
        if (foo) {
            // Agar localstorage'da ma'lumot bo'lsa
            if (info) {
                localStorage.setItem('info', JSON.stringify([...info, { ...inputData, id: new Date().getTime() }]))
            }
            // Agar localstorage'da ma'lumot yo'q bo'lsa
            else {
                localStorage.setItem('info', JSON.stringify([{ ...inputData, id: new Date().getTime() }]))
            }
        }
        // Ma'lumotni tahrirlash
        else {
            localStorage.setItem('info', JSON.stringify(
                info.map(item => item.id === inputData.id ? inputData : item)
            ))
            foo = true;
        }
        render();
        closeModal();
    }
    else {
        alert('Please fill in the all blanks!')
    }
})

// Ma'lumotlarni edit qilish funksiyasi
function edit(b) {
    foo = b;
    inputData = info[b];
    openModal();
    addBtn.innerText = 'Edit';
    statusVar.innerText = "Ma'lumotni tahrirlash"
    inputs.forEach(item => item.value = info[b][item.name])
    console.log(inputData);
}

// Delete funksiyasi
function deleteFunc(b) {
    let ask = confirm('Do you want to delete it?');
    if (ask) {
        localStorage.setItem('info', JSON.stringify(info.filter(item => item.id !== info[b].id)))
    }
    render();
}