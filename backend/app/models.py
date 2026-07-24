from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


class ApiModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )


class ProductVariant(ApiModel):
    id: str
    sku: str
    label: str
    tone: Literal["white", "grey", "black"]
    swatch_url: str
    image_url: str | None = None


class ProductDefinition(ApiModel):
    id: str
    sku: str | None = None
    name: str
    description: str
    desktop_description_lines: list[str] | None = None
    image_url: str
    learn_more_url: str | None = None
    badge: str | None = None
    unit_price: float
    compare_at_unit_price: float | None = None
    min_quantity: int | None = Field(default=None, ge=0)
    max_quantity: int | None = Field(default=None, ge=1)
    free_label: str | None = None
    variants: list[ProductVariant] | None = None


class PlanOption(ApiModel):
    id: str
    icon_url: str
    review_icon_url: str | None = None
    name: str
    highlight: str
    price: float
    compare_at_price: float | None = None
    description: str


class ProductStepDefinition(ApiModel):
    id: str
    kind: Literal["products"]
    step_number: int = Field(ge=1)
    title: str
    icon_url: str
    review_group: str
    cta_label: str
    products: list[ProductDefinition]


class PlanStepDefinition(ApiModel):
    id: str
    kind: Literal["plan"]
    step_number: int = Field(ge=1)
    title: str
    icon_url: str
    review_group: str
    cta_label: str
    plans: list[PlanOption]


BundleStepDefinition = Annotated[
    ProductStepDefinition | PlanStepDefinition,
    Field(discriminator="kind"),
]


class ShippingDefinition(ApiModel):
    id: str
    name: str
    icon_url: str
    price: float
    compare_at_price: float | None = None
    free_label: str | None = None
    contributes_to_savings: bool


class GuaranteeDefinition(ApiModel):
    image_url: str
    title: str
    description: str


class FinancingDefinition(ApiModel):
    monthly_price: float


class BundleConfiguration(ApiModel):
    version: Literal[1]
    open_step_id: str
    selected_plan_id: str
    active_variant_by_product: dict[str, str]
    quantities_by_sku: dict[str, int]


class BundleCatalog(ApiModel):
    version: Literal[1]
    title: str
    review_title: str
    review_subtitle: str
    steps: list[BundleStepDefinition]
    shipping: ShippingDefinition
    guarantee: GuaranteeDefinition
    financing: FinancingDefinition
    initial_configuration: BundleConfiguration
