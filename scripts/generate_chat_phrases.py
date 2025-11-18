"""
Генератор фраз для чата / сайта.
Запуск: python scripts/generate_chat_phrases.py --output data/phrases_5000.txt --count 5000 --sample-output data/phrases_sample_120.txt --sample-count 120
"""
import argparse
import random
from pathlib import Path

NAMES = ["Анна", "Илья", "Марина", "Дима", "AVZALØV", "Команда", "DJ Alex", "Промоутер", "Радио-хост"]
ADJECTIVES = ["крутой", "потрясающий", "вдохновляющий", "атмосферный", "мощный", "мягкий", "тёплый", "обволакивающий", "сочный"]
ACTIONS = ["поставь", "послушай", "порекомендуй", "поделись", "зацени", "поддержи", "забронируй", "оцените", "добавь"]
CONTEXTS = ["этот трек", "новый релиз", "этот сет", "плейлист на вечер", "мой лайв", "этот ремикс", "демо", "гостевой микс", "фан-версию"]
QUESTIONS = ["Как тебе?", "Что думаешь?", "Стоит ли добавлять в плейлист?", "Есть мнение?", "Пойдёт в ночной эфир?", "Чего не хватает?", "Соберёт танпол?", "Вписывается в атмосферу?"]
REPLIES = ["Обожаю его", "Это топ", "Не очень моё", "Идеально для утра", "Для поздней ночи — огонь", "Берём в эфир", "Мягко, но мощно", "Летит в избранное"]
BOOKINGS = ["Можем обсудить бэклайн", "Даты готовы?", "Где и когда выступать?", "Нужен саундчек", "Пришлю райдер"]
GREETINGS = ["Привет", "Здарова", "Здравствуйте", "Хеллоу", "Йо"]
EVENTS = ["вечеринка", "фестиваль", "суперсет", "радио-шоу", "квартирник"]

TEMPLATES = [
    "{greeting}, {name}!",
    "{name}, {action} {context}. {q}",
    "{action_cap} {context}, {name}? {q}",
    "{name}, {reply}",
    "Есть идея: {context} для {event}. {q}",
    "Хочу заказать: {book}.",
    "Крутой звук — {adj}. {reply}",
    "{greeting}, команда! Новый релиз: {context}. {q}",
    "Если любишь {adj} — послушай {context}.",
    "Записали новый трек, {name}. Мнения?",
    "{name}, нужен апдейт по {context}. {q}",
    "{greeting}! {context_cap} готово к релизу, проверь.",
]

def rand(items):
    return random.choice(items)

def build_phrase() -> str:
    context_value = rand(CONTEXTS)
    data = {
        "greeting": rand(GREETINGS),
        "name": rand(NAMES),
        "adj": rand(ADJECTIVES),
        "action": rand(ACTIONS),
        "action_cap": rand(ACTIONS).capitalize(),
        "context": context_value,
        "context_cap": context_value.capitalize(),
        "q": rand(QUESTIONS),
        "reply": rand(REPLIES),
        "event": rand(EVENTS),
        "book": rand(BOOKINGS),
    }
    template = rand(TEMPLATES)
    return template.format(**data)

def generate_unique(count: int) -> list[str]:
    phrases = set()
    while len(phrases) < count:
        phrases.add(build_phrase())
    return list(phrases)

def save_phrases(path: Path, phrases: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(phrases) + "\n", encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description="Generate chat phrases")
    parser.add_argument("--output", type=Path, default=Path("data/phrases_5000.txt"), help="Путь к файлу с фразами")
    parser.add_argument("--count", type=int, default=5000, help="Количество фраз")
    parser.add_argument("--sample-output", type=Path, default=Path("data/phrases_sample_120.txt"), help="Куда сохранить выборку")
    parser.add_argument("--sample-count", type=int, default=120, help="Размер выборки")
    args = parser.parse_args()

    phrases = generate_unique(args.count)
    save_phrases(args.output, phrases)

    sample = phrases[: args.sample_count]
    save_phrases(args.sample_output, sample)

    print(f"Generated {len(phrases)} phrases → {args.output}")
    print(f"Sample {len(sample)} phrases → {args.sample_output}")

if __name__ == "__main__":
    main()
