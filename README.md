# Portfólio | Leticia Costa

Site estático (HTML, CSS e JS puro, sem build) pronto para o GitHub Pages.

## Páginas

| Caminho      | Para quê                                                         |
|--------------|------------------------------------------------------------------|
| `/`          | Página principal genérica (apresentação + contato)               |
| `/grafica/`  | Vagas de design gráfico, embalagens e impressos                  |
| `/produto/`  | Vagas de product design (UX/UI)                                  |
| `/social/`   | Vagas de social media, vídeo e foto                              |
| `/completo/` | Vagas híbridas: todos os trabalhos                               |

As páginas secundárias não são linkadas pela principal: envie o link certo para cada vaga.

## Rodar localmente

```bash
cd let
python3 -m http.server 8765
# abrir http://localhost:8765/
```

## Publicar no GitHub Pages

```bash
git init && git add . && git commit -m "Portfólio Leticia Costa"
git branch -M main
git remote add origin git@github.com:<usuario>/<repositorio>.git
git push -u origin main
```

No GitHub: **Settings → Pages → Source: Deploy from a branch → main / (root)**.
O site fica em `https://<usuario>.github.io/<repositorio>/` e as páginas em `.../grafica/`, `.../produto/` etc.

## Estrutura

```
index.html                 página principal
grafica/ produto/ social/ completo/   páginas por tipo de vaga
assets/css/base.css        design system (tokens, componentes)
assets/css/*.css           estilos por página/trilha
assets/js/main.js          animações e interações
assets/js/mocks-*.js       mockups em SVG/CSS (renderizados em [data-mock])
assets/img/                screenshots reais (Cuidawise, Deep Saúde)
```

## Trocar mockup por imagem real

Onde houver `<div data-mock="nome"></div>`, substitua por:

```html
<img src="../assets/img/arquivo.jpg" alt="Descrição da peça" data-zoom>
```
