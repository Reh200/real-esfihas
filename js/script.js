// =================== CARRINHO DE COMPRAS ===================
const carrinho = [];

function enviarPedido(elemento, categoria) {
  const item = elemento.closest('.item');
  const nome = item.querySelector('strong, h4').innerText;
  const preco = item.querySelector('span').innerText;

  carrinho.push({ nome, preco });

  alert(`${nome} adicionado ao carrinho.`);
}

function finalizarCompra() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  let mensagem = "Olá! Gostaria de fazer o seguinte pedido:\n\n";
  carrinho.forEach((item, i) => {
    mensagem += `${i + 1}. ${item.nome} - ${item.preco}\n`;
  });

  const mensagemCodificada = encodeURIComponent(mensagem);
  const numeroWhatsApp = "SEUNUMEROAQUI"; // Coloque o número do restaurante
  const link = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;

  window.open(link, '_blank');
}

// =================== CARROSSEL DO BANNER ===================
document.addEventListener('DOMContentLoaded', () => {
  const bannerImages = document.querySelectorAll('.banner-img');
  
  // Executa a lógica apenas se existirem imagens de banner no HTML
  if (bannerImages.length > 0) {
    let currentImageIndex = 0;
    const changeInterval = 4000; // Tempo de troca: 4 segundos

    function changeBanner() {
      bannerImages[currentImageIndex].classList.remove('active');
      currentImageIndex = (currentImageIndex + 1) % bannerImages.length;
      bannerImages[currentImageIndex].classList.add('active');
    }

    setInterval(changeBanner, changeInterval);
  }
});