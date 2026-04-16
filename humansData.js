/**
 * Модуль humansData — асинхронное получение массива объектов Human.
 *
 * Объект Human:
 *   id        {number}  — уникальный идентификатор
 *   firstName {string}  — имя
 *   lastName  {string}  — фамилия
 *   age       {number}  — возраст
 *   gender    {string}  — 'male' | 'female'
 *   address   {string}  — адрес
 *   phone     {string}  — телефон
 */

/**
 * Возвращает массив случайного размера (от 5 до 20) объектов Human,
 * полученных через публичное API randomuser.me.
 *
 * @returns {Promise<Human[]>}
 */
export async function getData() {
  const count = Math.floor(Math.random() * 16) + 5; // 5–20 человек
  const res = await fetch(
    `https://randomuser.me/api/?results=${count}&nat=us,gb,au&inc=name,gender,dob,location,phone`
  );

  if (!res.ok) throw new Error(`randomuser.me вернул HTTP ${res.status}`);

  const data = await res.json();

  return data.results.map((user, index) => ({
    id: Date.now() + index,
    firstName: user.name.first,
    lastName: user.name.last,
    age: user.dob.age,
    gender: user.gender,
    address: `${user.location.street.number} ${user.location.street.name}, ${user.location.city}`,
    phone: user.phone
  }));
}
