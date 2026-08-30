from engine.rules.checker import check_wrong_subnet_mask


def test_correct_subnet_mask():
    result = check_wrong_subnet_mask(
        "192.168.10.20",
        "255.255.255.0",
        "255.255.255.0",
    )

    assert result["status"] == "PASS"


def test_wrong_subnet_mask():
    result = check_wrong_subnet_mask(
        "192.168.10.20",
        "255.255.255.0",
        "255.255.255.128",
    )

    assert result["status"] == "FAIL"
    assert result["rule_id"] == "WRONG_SUBNET_MASK"


def test_missing_expected_mask():
    result = check_wrong_subnet_mask(
        "192.168.10.20",
        "255.255.255.0",
        "",
    )

    assert result["status"] == "UNKNOWN"


def test_invalid_subnet_mask():
    result = check_wrong_subnet_mask(
        "192.168.10.20",
        "not-a-mask",
        "255.255.255.0",
    )

    assert result["status"] == "UNKNOWN"