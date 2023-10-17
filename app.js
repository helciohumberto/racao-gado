const form = document.querySelector("form")
const resp = document.querySelector("#res1")
const resp1 = document.querySelector("#res2")
const resp2 = document.querySelector("#res3")
const resp3 = document.querySelector("#res4")

Swal.fire({
  icon: 'warning',
  title: 'Atenção!',
  text: '"Quantidade Ração (Kg)", é a quantidade em que cada animal come.'
})

form.addEventListener("submit", (e) => {
  const cabeca = Number(form.inCabeca.value)
  const kgDia = Number(form.inRacaoDia.value)
  const qtDias = Number(form.inQtDias.value)
  const precoRacao = Number(form.inPrecoR.value)


  const primeiraConta = (cabeca * kgDia)
  const segundaConta = (primeiraConta * qtDias)
  const total = (segundaConta * precoRacao)
  const totalKgRacao = primeiraConta * qtDias 

  const custoDiv = (total / cabeca)
  resp.innerText = `Ração Dia: ${primeiraConta.toFixed(3)}Kg `
  resp3.innerText = `Total Ração: ${totalKgRacao.toFixed(3)}Kg`

  resp1.innerText = `Preço Total da Ração = R$:${total.toFixed(2)} `
  resp2.innerText = `Gasto por Cabeça R$:${custoDiv.toFixed(2)}`
  e.preventDefault()

})

form.addEventListener("reset", () => {
  resp.innerText = ""
  resp1.innerText = ""
  resp2.innerText = ""
  resp3.innerText = ""
})