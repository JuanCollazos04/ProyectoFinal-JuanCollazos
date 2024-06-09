const contenido = document.getElementById("contenido");
const btncarrito = document.getElementById("btn-carrito");
const divCarrito = document.getElementById("carrito");

function cargarProductos() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    nombre: "Campeones del Mundo 1978: RETRO",
                    camisa: "https://www.vintagefootballclub.com/wp-content/uploads/2018/06/argentina-1978-1-1.jpg",
                    precio: 64,
                },
                {
                    id: 2,
                    nombre: "Campeones del mundo 1986: RETRO",
                    camisa: "https://barraaltafutbol.com/wp-content/uploads/2021/05/ArgAway86.1.jpg",
                    precio: 68,
                },
                {
                    id: 3,
                    nombre: "Campeones del mundo 2022: RETRO",
                    camisa: "https://i.ebayimg.com/thumbs/images/g/YlQAAOSwvHdj9L8c/s-l1200.jpg",
                    precio: 74,
                },
                {
                    id: 4,
                    nombre: "Subcampeones del mundo 1978: RETRO",
                    camisa: "https://tienda.panenka.org/content/images/thumbs/0002289_holanda-mundial-1978_550.jpeg",
                    precio: 60,
                },
                {
                    id: 5,
                    nombre: "Subcampeones del mundo 1986: RETRO",
                    camisa: "https://flashback.com.co/wp-content/uploads/2024/03/Camiseta-Alemania-1986-frente.png",
                    precio: 62,
                },
                {
                    id: 6,
                    nombre: "Subcampeones del mundo 2022: RETRO",
                    camisa: "https://www.thunderinternacional.com/cdn/shop/products/camisetas-nike-francia-2022-2.jpg?v=1663870808",
                    precio: 64,
                }
            ]);
        }, 100);
    });
}

let productos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let mostrar = false;

const botonMostrarOcultar = document.createElement("button");
botonMostrarOcultar.innerText = "Mostrar";
botonMostrarOcultar.className = "btn-carrito";
botonMostrarOcultar.onclick = () => mostrarOcultar();

btncarrito.appendChild(botonMostrarOcultar);

const botonTotal = document.createElement("button");
botonTotal.innerText = "Finalizar Compra";
botonTotal.className = "btn-carrito";
botonTotal.onclick = finalizar;

btncarrito.appendChild(botonTotal);

const contenedorMostrar = document.createElement("div");

function finalizar() {
    let total = carrito.reduce((suma, el) => suma + el.precio, 0);
    Swal.fire({
        title: "¿Desea finalizar la compra?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, deseo finalizar la compra"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "¡Compra realizada con éxito!",
                text: `Su total fue ${total} dólares`,
                icon: "success"
            }).then(() => {
                carrito = [];
                localStorage.setItem("carrito", JSON.stringify(carrito));
                actualizarCarrito();
            });
        }
    });
}

function agregarAlCarrito(id) {
    const producto = productos.find(el => el.id === id);
    if (carrito.some(element => element.id === producto.id)) {
        Swal.fire({
            title: "LO SENTIMOS",
            text: "Actualmente solo puedes tomar 1 unidad de cada producto",
            icon: "warning"
        });
    } else {
        Swal.fire({
            title: "Cargando producto",
            html: "Estamos cargando tu producto al Carrito",
            timer: 1000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            },
            willClose: () => {
                carrito.push(producto);
                localStorage.setItem("carrito", JSON.stringify(carrito));
                if (mostrar) {
                    actualizarCarrito();
                }
                Swal.fire("Producto cargado con éxito!", "", "success");
            }
        });
    }
}

function quitarDelCarrito(id) {
    Swal.fire({
        title: "Eliminar producto del carrito?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        denyButtonText: `No eliminar`
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire("Eliminado con éxito!", "", "success");
            carrito = carrito.filter(el => el.id !== id);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            if (mostrar) {
                actualizarCarrito();
            }
        } else if (result.isDenied) {
            Swal.fire("El producto continúa en el carrito!", "", "info");
        }
    });
}

function crearCard(producto, contenedorId) {
    const card = document.createElement("div");
    card.className = "card";

    const titulo = document.createElement("h4");
    titulo.innerText = producto.nombre;
    titulo.className = "titulo";

    const img = document.createElement("img");
    img.src = producto.camisa;
    img.alt = producto.nombre;
    img.className = "img";

    const precio = document.createElement("p");
    precio.innerText = `${producto.precio} DÓLARES`;

    const botonAgregar = document.createElement("button");
    botonAgregar.innerText = contenedorId === "contenido" ? "Agregar" : "Quitar del carrito";
    botonAgregar.className = "btn-add";
    botonAgregar.onclick = contenedorId === "contenido" ? 
        () => agregarAlCarrito(producto.id) : 
        () => quitarDelCarrito(producto.id);

    card.appendChild(titulo);
    card.appendChild(img);
    card.appendChild(precio);
    card.appendChild(botonAgregar);

    document.getElementById(contenedorId).appendChild(card);
}

function mostrarOcultar() {
    if (mostrar) {
        divCarrito.style.display = "none";
        mostrar = false;
        botonMostrarOcultar.innerText = "Mostrar";
        botonTotal.style.display = "none";
    } else {
        if (carrito.length === 0) {
            divCarrito.innerHTML = "<p>El carrito está vacío</p>";
        } else {
            actualizarCarrito();
            divCarrito.style.display = "block";
            mostrar = true;
            botonMostrarOcultar.innerText = "Ocultar";
            botonTotal.style.display = "block";
        }
    }
}

function actualizarCarrito() {
    divCarrito.innerHTML = "";
    carrito.forEach(el => crearCard(el, "carrito"));
}

botonTotal.style.display = "none";

cargarProductos().then(data => {
    productos = data;
    productos.forEach(el => crearCard(el, "contenido"));
});

if (mostrar) {
    actualizarCarrito();
}