1. Видалено всі файлові залежності з моноліта
2. В таск ентіті змінив photoData на photoUrl для продуктивності роботи (щоб постійно не діставати силку з мікросервіса)
3. Додано Redis, який працює як черга та передає завдання щодо додавання чи видалення в базу даних моноліта.
4. Доданий сокет, але наразі він не виконує ніякої функціональності, лише емітує підключення серверів та висилає тестове повідомлення.
5. Змінені файли конфігурації (.env) для мікросервіса та моноліта:

приклад для мікросервіса:

DATABASE_HOST='localhost'
DATABASE_PORT=5432
DATABASE_PASSWORD='postgres'
DATABASE_NAME='postgres'
DATABASE_USERNAME='postgres'
JWT_SECRET='SECRET'
REDIS_HOST="localhost"
REDIS_PORT=6379

приклад для моноліта:

DATABASE_HOST='localhost'
DATABASE_PORT=5432
DATABASE_PASSWORD='postgres'
DATABASE_NAME='postgres'
DATABASE_USERNAME='postgres'
AWS_REGION='eu-north-1'
AWS_ACCESS_KEY_ID='AKIAZHYENLWV6YT43VKU'
AWS_SECRET_ACCESS_KEY='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'
AWS_PUBLIC_BUCKET_NAME='amazon201210'
REDIS_HOST="localhost"
REDIS_PORT=6379

5. Весь функціонал файлів добавлений до мікросервіса 

ендпоїнти:

5.1. Добавлення файла

POST http://localhost:3001/files/13517d40-fc24-4038-870b-1f9a93b207f2/photo
(http://localhost:3001/files/:taskId/photo)

5.2 Видалення файла

DELETE http://localhost:3001/files/photo
body: 
{
    "file_url": "https://amazon201210.s3.eu-north-1.amazonaws.com/f8619e24-47a2-46d8-930a-9481d93f68b2-d468ed43-8ed2-4b62-8e1b-c67582ac69b0-1918aaac-3587-434f-bd99-4f3a6f1ba487.png"
}