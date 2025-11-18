import json
from pathlib import Path

ROLE_DEFINITIONS = [
    {"name": "Главный админ", "short": "Владелец системы и главный распределитель прав.", "flags": {"assign_roles": True, "listen_all_tracks": True, "adminAssignable": False}},
    {"name": "Супер-админ", "short": "Помогает управлять ролями и настройками.", "flags": {"assign_roles": True, "listen_all_tracks": True}},
    {"name": "Модератор", "short": "Следит за чатом и порядком.", "flags": {"assign_roles": True}},
    {"name": "Старший модератор", "short": "Расширенные права модерации, бан/разбан.", "flags": {"assign_roles": True}},
    {"name": "DJ (Resident)", "short": "Резидентный диджей со свободным доступом к каталогу.", "flags": {"listen_all_tracks": True}},
    {"name": "Резидент / DJ", "short": "Локальный DJ с повышенными правами.", "flags": {"listen_all_tracks": True}},
    {"name": "Радио-хост", "short": "Ведёт эфиры и ставит любые треки.", "flags": {"listen_all_tracks": True}},
    {"name": "Подкаст-хост", "short": "Ведущий подкастов, ранний доступ к материалам.", "flags": {"listen_all_tracks": True}},
    {"name": "Куратор плейлистов", "short": "Формирует официальные подборки.", "flags": {"listen_all_tracks": True}},
    {"name": "Редактор плейлистов", "short": "Помогает куратору обновлять подборки.", "flags": {}},
    {"name": "Лейбл-менеджер", "short": "Представитель лейбла, доступ к статистике.", "flags": {"listen_all_tracks": True}},
    {"name": "A&R Scout", "short": "Ищет новых артистов и демо.", "flags": {}},
    {"name": "Букер", "short": "Организует бронирования и выступления.", "flags": {}},
    {"name": "Промоутер", "short": "Продвигает мероприятия и релизы.", "flags": {}},
    {"name": "PR / Менеджер по связям", "short": "Работает со СМИ и пабликами.", "flags": {}},
    {"name": "Фан-клуб лидер", "short": "Руководит фан-сообществом.", "flags": {}},
    {"name": "Superfan", "short": "Выделенный активный фан.", "flags": {"visibleInProfile": True}},
    {"name": "Fan", "short": "Обычный фан, базовый доступ.", "flags": {}},
    {"name": "Collector", "short": "Собирает релизы и редкие версии.", "flags": {}},
    {"name": "Archivist", "short": "Хранитель архивов и редких записей.", "flags": {}},
    {"name": "Historian", "short": "Исследует историю релизов.", "flags": {}},
    {"name": "Критик / Рецензент", "short": "Пишет рецензии и обзоры.", "flags": {}},
    {"name": "Автор статей", "short": "Готовит заметки и интервью.", "flags": {}},
    {"name": "Фотограф", "short": "Официальный фотограф событий.", "flags": {}},
    {"name": "Видеограф", "short": "Снимает клипы и репортажи.", "flags": {}},
    {"name": "VJ / Визуалист", "short": "Делает визуализации для сетов.", "flags": {}},
    {"name": "Light Designer", "short": "Настраивает световые шоу.", "flags": {}},
    {"name": "Sound Engineer", "short": "Звукорежиссёр лайвов.", "flags": {}},
    {"name": "Mixer", "short": "Сводит треки и лайв-сеты.", "flags": {}},
    {"name": "Mastering Engineer", "short": "Отвечает за мастеринг.", "flags": {}},
    {"name": "Producer", "short": "Продюсер проекта.", "flags": {}},
    {"name": "Beatmaker", "short": "Создаёт биты.", "flags": {}},
    {"name": "Composer", "short": "Пишет музыку и мелодии.", "flags": {}},
    {"name": "Lyricist", "short": "Автор текстов.", "flags": {}},
    {"name": "Remixer", "short": "Делает ремиксы.", "flags": {}},
    {"name": "Sampler", "short": "Работает с семплами.", "flags": {}},
    {"name": "Label Owner", "short": "Владелец лейбла, VIP-доступ.", "flags": {"listen_all_tracks": True}},
    {"name": "Sponsor", "short": "Спонсор проекта, бесплатное прослушивание.", "flags": {"listen_all_tracks": True}},
    {"name": "Investor", "short": "Инвестор платформы, VIP.", "flags": {"listen_all_tracks": True}},
    {"name": "Hall of Fame", "short": "Легенда платформы.", "flags": {"listen_all_tracks": True, "visibleInProfile": True}},
    {"name": "Legend", "short": "Эксклюзивный бейдж для легенд.", "flags": {"visibleInProfile": True}},
    {"name": "MVP", "short": "Самый ценный участник.", "flags": {"visibleInProfile": True}},
    {"name": "Beta Tester", "short": "Тестирует новые функции.", "flags": {}},
    {"name": "Developer", "short": "Разработчик платформы.", "flags": {}},
    {"name": "Frontend Engineer", "short": "Фронтенд разработчик.", "flags": {}},
    {"name": "Backend Engineer", "short": "Бэкенд разработчик.", "flags": {}},
    {"name": "DevOps", "short": "Инженер инфраструктуры.", "flags": {}},
    {"name": "QA Engineer", "short": "Тестирует качество.", "flags": {}},
    {"name": "Designer", "short": "Отвечает за визуал.", "flags": {}},
    {"name": "UX Specialist", "short": "Следит за UX.", "flags": {}},
    {"name": "Translator", "short": "Локализует контент.", "flags": {}},
    {"name": "Community Manager", "short": "Управляет сообществом.", "flags": {}},
    {"name": "Social Media Manager", "short": "Ведёт соцсети.", "flags": {}},
    {"name": "Event Manager", "short": "Организует события.", "flags": {}},
    {"name": "Tour Manager", "short": "Сопровождает гастроли.", "flags": {}},
    {"name": "Roadie", "short": "Техник на мероприятиях.", "flags": {}},
    {"name": "Press", "short": "Работник прессы/СМИ.", "flags": {}},
    {"name": "Journalist", "short": "Журналист с правами интервью.", "flags": {}},
    {"name": "Teacher / Mentor", "short": "Ментор для новичков.", "flags": {}},
    {"name": "Trainer", "short": "Проводит мастер-классы.", "flags": {}},
    {"name": "Scholar / Researcher", "short": "Изучает музыку и сцены.", "flags": {}},
    {"name": "Collector Pro", "short": "Профессиональный коллекционер.", "flags": {}},
    {"name": "Archivist Pro", "short": "Продвинутый архивариус.", "flags": {}},
    {"name": "Label Scout", "short": "Скаут от лейбла.", "flags": {}},
    {"name": "Playlist Editor", "short": "Редактор официальных плейлистов.", "flags": {}},
    {"name": "Playlist Curator", "short": "Куратор тематического плейлиста.", "flags": {"listen_all_tracks": True}},
    {"name": "Reporter", "short": "Освещает новости сцены.", "flags": {}},
    {"name": "Moderator Helper", "short": "Помощник модератора.", "flags": {}},
    {"name": "Support", "short": "Техническая поддержка.", "flags": {}},
    {"name": "Bot Manager", "short": "Управляет сервисными ботами.", "flags": {"assign_roles": True}},
    {"name": "Bot: Welcome", "short": "Автовстречающий бот.", "flags": {"defaultBot": True}},
    {"name": "Bot: Notifications", "short": "Бот уведомлений.", "flags": {"defaultBot": True}},
    {"name": "Bot: AutoMod", "short": "Авто-модерация.", "flags": {"defaultBot": True}},
    {"name": "Bot: Stats", "short": "Собирает статистику.", "flags": {"defaultBot": True}},
    {"name": "Bot: PlaylistGen", "short": "Генерирует плейлисты.", "flags": {"defaultBot": True}},
    {"name": "Bot: Announcements", "short": "Бот объявлений.", "flags": {"defaultBot": True}},
    {"name": "Bot: Welcome+", "short": "Расширенный приветственный бот.", "flags": {"defaultBot": True}},
    {"name": "Bot: DMResponder", "short": "Отвечает на личные сообщения.", "flags": {"defaultBot": True}},
    {"name": "Bot: StreamMonitor", "short": "Следит за стримами.", "flags": {"defaultBot": True}},
    {"name": "Bot: Backup", "short": "Резервный бот.", "flags": {"defaultBot": True}},
    {"name": "VIP", "short": "Платиновый пользователь.", "flags": {"listen_all_tracks": True, "visibleInProfile": True}},
    {"name": "Supporter", "short": "Поддержал проект, бонусы.", "flags": {}},
    {"name": "Contributor", "short": "Вносит вклад в контент или код.", "flags": {}},
    {"name": "Sponsor Liaison", "short": "Связь со спонсорами.", "flags": {}},
    {"name": "Legal", "short": "Юрист проекта.", "flags": {}},
    {"name": "Accountant", "short": "Финансовый контроль.", "flags": {}},
    {"name": "Collector Legend", "short": "Легендарный коллекционер.", "flags": {"visibleInProfile": True}},
    {"name": "Trendsetter", "short": "Формирует тренды.", "flags": {"visibleInProfile": True}},
    {"name": "Early Adopter", "short": "Ранний участник.", "flags": {"visibleInProfile": True}},
    {"name": "Newcomer", "short": "Новичок на платформе.", "flags": {}},
    {"name": "Rookie", "short": "Только что пришёл, ограниченный доступ.", "flags": {}},
    {"name": "Mentor+", "short": "Наставник, может выдавать бейджи.", "flags": {"assign_roles": True}},
    {"name": "Guardian", "short": "Защитник сообщества с расширенной модерацией.", "flags": {"assign_roles": True}},
    {"name": "Streamer", "short": "Стример с интеграцией плеера.", "flags": {"listen_all_tracks": True}},
    {"name": "Partner", "short": "Партнёр проекта.", "flags": {"listen_all_tracks": True}},
    {"name": "Community Star", "short": "Звезда сообщества.", "flags": {"visibleInProfile": True}},
    {"name": "Legacy", "short": "Участник с историей на платформе.", "flags": {"visibleInProfile": True}},
    {"name": "TestBot", "short": "Бот для QA/интеграции.", "flags": {"defaultBot": True}},
    {"name": "System Bot", "short": "Системный бот, занимает 99-й слот.", "flags": {"defaultBot": True}},
    {"name": "Unassigned", "short": "Свободный слот роли.", "flags": {"visibleInProfile": True}},
]

# Ensure there are exactly 100 roles
if len(ROLE_DEFINITIONS) != 100:
    raise SystemExit(f"Expected 100 roles, got {len(ROLE_DEFINITIONS)}")

def build_role_entry(idx: int, role: dict) -> dict:
    role_id = f"role_{idx:03d}"
    default_holder = "admin" if idx == 1 else f"bot_{idx:03d}"
    tooltip = role["short"] if len(role["short"]) < 140 else role["short"][:136] + "..."
    permissions = {
        "assign_roles": bool(role["flags"].get("assign_roles")),
        "ban_users": role["flags"].get("ban_users", False),
        "listen_all_tracks": bool(role["flags"].get("listen_all_tracks")),
        "edit_site": role["flags"].get("edit_site", False),
    }
    return {
        "id": role_id,
        "name": role["name"],
        "short": role["short"],
        "tooltip": tooltip,
        "permissions": permissions,
        "visibleInProfile": bool(role["flags"].get("visibleInProfile", True)),
        "defaultHolder": default_holder if role["name"] != "Unassigned" else None,
        "adminAssignable": bool(role["flags"].get("adminAssignable", False)),
        "defaultBot": bool(role["flags"].get("defaultBot", False)),
    }

def main() -> None:
    roles = [build_role_entry(idx + 1, role) for idx, role in enumerate(ROLE_DEFINITIONS)]
    output = {"meta": {"version": 1, "defaultBotSlots": 99}, "roles": roles}
    out_path = Path(__file__).resolve().parent.parent / "data" / "roles-catalog.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Saved {len(roles)} roles to {out_path}")

if __name__ == "__main__":
    main()
