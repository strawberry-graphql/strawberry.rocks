"""Settings, read from environment variables"""

import os


class MissingSettingError(Exception):
    pass


def optional_setting(name: str) -> str | None:
    return os.environ.get(name) or None


def setting(name: str) -> str:
    # Read when needed, so the API still starts (e.g. in previews) when a
    # setting is missing, and only the operations that need it fail
    value = optional_setting(name)

    if value is None:
        raise MissingSettingError(f"{name} is not set")

    return value
