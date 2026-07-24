from functools import lru_cache
from pathlib import Path

from fastapi import APIRouter

from app.models import BundleCatalog

router = APIRouter(prefix="/api/catalog", tags=["catalog"])
CATALOG_PATH = (
    Path(__file__).resolve().parents[1] / "data" / "bundle-catalog.json"
)


@lru_cache(maxsize=1)
def load_catalog() -> BundleCatalog:
    return BundleCatalog.model_validate_json(
        CATALOG_PATH.read_text(encoding="utf-8"),
    )


@router.get(
    "",
    summary="Get the bundle-builder catalog",
    response_model_exclude_none=True,
)
def get_catalog() -> BundleCatalog:
    return load_catalog()
