import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// создание объекта приложения Express:
const app = express();

// безопасность в браузере (несовпадение origin):
app.use(cors());

// парсинг body на сервере (из строки получаем json):
app.use(
  bodyParser.json({
    type(req) {
      return true;
    },
  })
);

// установка заголовков ответа:
app.use(function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// массив с постами:
let posts = [
  {
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere dolorem quam vero cumque! Veritatis ab quae placeat asperiores, deleniti voluptatem laborum ipsum sed adipisci animi ex dolor amet nihil vel!',
    id: 0,
    created: Date.now(),
  },
];

let nextId = 1; // для создания id постов

// обработка get-запроса -> получение всех постов с сервера:
app.get('/posts', (req, res) => {
  res.send(JSON.stringify(posts));
});

// обработка get-запроса -> получение конкретного поста с сервера по его id (динамический параметр):
app.get('/posts/:id', (req, res) => {
  const postId = Number(req.params.id);
  const index = posts.findIndex((o) => o.id === postId);
  res.send(JSON.stringify({ post: posts[index] }));
});

// обработка post-запроса -> создание поста и сохранение его данных на сервере:
app.post('/posts', (req, res) => {
  posts.push({ ...req.body, id: nextId++, created: Date.now() });
  res.status(204);
  res.end();
});

// обработка put-запроса -> редактирование поста по его id и обновление данных поста на сервере:
app.put('/posts/:id', (req, res) => {
  const postId = Number(req.params.id);
  posts = posts.map((o) => {
    if (o.id === postId) {
      return {
        ...o,
        ...req.body,
        id: o.id,
      };
    }
    return o;
  });
  res.status(204).end();
});

// обработка delete-запроса -> удаление поста на сервере по его id (динамический параметр):
app.delete('/posts/:id', (req, res) => {
  const postId = Number(req.params.id);
  const index = posts.findIndex((o) => o.id === postId);
  if (index !== -1) {
    posts.splice(index, 1);
  }
  res.status(204);
  res.end();
});

const port = process.env.PORT || 7070;

const bootstrap = async () => {
  try {
    app.listen(port, () =>
      console.log(`The server is running on port ${port}.`)
    );
  } catch (error) {
    console.error(error);
  }
};

bootstrap();
