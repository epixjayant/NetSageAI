from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from engine.rules.checker import (
    check_duplicate_ip,
    check_gateway_mismatch,
    check_interface_down,
    check_missing_route,
    check_missing_vlan,
    check_wrong_subnet_mask,
)


app = FastAPI(
    title="NetSage AI API",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RuleRequest(BaseModel):
    rule_id: str
    evidence: dict[str, Any]


RULES = {
    "GATEWAY_MISMATCH": check_gateway_mismatch,
    "WRONG_SUBNET_MASK": check_wrong_subnet_mask,
    "INTERFACE_DOWN": check_interface_down,
    "MISSING_VLAN": check_missing_vlan,
    "MISSING_ROUTE": check_missing_route,
    "DUPLICATE_IP": check_duplicate_ip,
}


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "netsage-ai-api",
    }


@app.post("/api/rules/check")
def check_rule(request: RuleRequest) -> dict[str, Any]:
    rule = RULES.get(request.rule_id)

    if rule is None:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown rule: {request.rule_id}",
        )

    try:
        result = rule(**request.evidence)
    except TypeError as exc:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid evidence for {request.rule_id}: {exc}",
        ) from exc

    return result