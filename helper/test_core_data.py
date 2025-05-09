"""Test cases for the CoreData class."""
import pytest
from helper.core_data import CoreData

@pytest.fixture(name="setup")
def fixture_setup(tmp_path):
    """Fixture to set up the test environment for CoreData."""
    # Create a temporary directory structure for the test
    # This is a mock of the Arduino core path
    core_path = tmp_path / "packages" / "esp8266" / "hardware" / "esp8266" / "2.7.4"
    core_path.mkdir(parents=True)
    pytest.core_path = core_path
    # Create a mock boards.txt file
    boards_txt_content = """
generic.name=Generic ESP8266 Module
generic.build.variant=generic
generic.menu.eesz.1M512.build.flash_size=1M
generic.menu.eesz.2M64.build.flash_size=2M
generic.menu.eesz.4M2M.build.flash_size=4M
generic.menu.eesz.512K32.build.flash_size=512K
d1_mini.name=LOLIN(WEMOS) D1 R2 & mini
d1_mini.build.variant=d1_mini
d1_mini.menu.eesz.4M.build.flash_size=4M
    """
    boards_txt_path = core_path / "boards.txt"
    boards_txt_path.write_text(boards_txt_content)

    # Create a mock variant directory
    variant_path = core_path / "variants" / "d1_mini"
    variant_path.mkdir(parents=True)
    # Create a mock pins_arduino.h file
    pins_arduino_content = """
#define LED_BUILTIN 2
    """
    (variant_path / "pins_arduino.h").write_text(pins_arduino_content)
    return tmp_path

@pytest.fixture(name="setup_esp32")
def fixture_setup_esp32(tmp_path):
    """Fixture to set up the test environment for CoreData."""
    # Create a temporary directory structure for the test
    # This is a mock of the Arduino core path
    core_path = tmp_path / "packages" / "esp32" / "hardware" / "esp32" / "3.2.0"
    core_path.mkdir(parents=True)
    pytest.core_path = core_path
    # Create a mock boards.txt file
    boards_txt_content = """
d1_mini32.name=WEMOS D1 MINI ESP32
d1_mini32.build.variant=d1_mini32
d1_mini32.build.flash_size=4MB
    """
    boards_txt_path = core_path / "boards.txt"
    boards_txt_path.write_text(boards_txt_content)

    # Create a mock variant directory
    variant_path = core_path / "variants" / "d1_mini32"
    variant_path.mkdir(parents=True)
    # Create a mock pins_arduino.h file
    pins_arduino_content = """
static const uint8_t LED_BUILTIN = 2;
    """
    (variant_path / "pins_arduino.h").write_text(pins_arduino_content)
    return tmp_path

@pytest.fixture(name="setup_wrong_led_builtin_value")
def fixture_setup_wrong_led_builtin_value(tmp_path):
    """Fixture to set up the test environment for CoreData with wrong LED_BUILTIN value."""
    # Create a temporary directory structure for the test
    # This is a mock of the Arduino core path
    core_path = tmp_path / "packages" / "esp8266" / "hardware" / "esp8266" / "2.7.4"
    core_path.mkdir(parents=True)
    pytest.core_path = core_path
    # Create a mock boards.txt file
    boards_txt_content = """
d1_mini.name=LOLIN(WEMOS) D1 R2 & mini
d1_mini.build.variant=d1_mini
d1_mini.menu.eesz.4M.build.flash_size=4M
    """
    boards_txt_path = core_path / "boards.txt"
    boards_txt_path.write_text(boards_txt_content)

    # Create a mock variant directory
    variant_path = core_path / "variants" / "d1_mini"
    variant_path.mkdir(parents=True)
    # Create a mock pins_arduino.h file
    pins_arduino_content = """
#define LED_BUILTIN wrong_value
    """
    (variant_path / "pins_arduino.h").write_text(pins_arduino_content)
    return tmp_path

@pytest.fixture(name="setup_missing_board_txt")
def fixture_setup_missing_board_txt(tmp_path):
    """Fixture to set up the test environment for CoreData with missing boards.txt."""
    # Create a temporary directory structure for the test
    # This is a mock of the Arduino core path
    core_path = tmp_path / "packages" / "esp8266" / "hardware" / "esp8266" / "2.7.4"
    core_path.mkdir(parents=True)
    pytest.core_path = core_path
    return tmp_path

def test_core_data_initialization(setup):
    """Test the initialization of CoreData with a valid core path."""
    core_data = CoreData("esp8266", "2.7.4", str(setup))
    assert core_data.core_name == "esp8266"
    assert core_data.core_path == str(pytest.core_path)

def test_core_data_initialization_core_path_error(setup):
    """Test the initialization of CoreData with an invalid core path."""
    with pytest.raises(ValueError):
        CoreData("esp8266", "2.7.4", str(setup) + "/invalid_path")

def test_core_data_initialization_missing_board_txt(setup_missing_board_txt):
    """Test the initialization of CoreData with a missing boards.txt file."""
    with pytest.raises(ValueError) as e_missing_board_txt:
        CoreData("esp8266", "2.7.4", str(setup_missing_board_txt))
    assert str(e_missing_board_txt.value
               ) == f"Error: could not found {str(pytest.core_path)}/boards.txt"

def test_get_data(setup):
    """Test the __get_data method of CoreData."""
    core_data = CoreData("esp8266", "2.7.4", str(setup))
    boards = core_data.boards
    assert "d1_mini" in boards
    assert boards["d1_mini"]["name"] == "LOLIN(WEMOS) D1 R2 & mini"
    assert boards["d1_mini"]["variant"] == "d1_mini"
    assert boards["d1_mini"]["flash_size"] == ["4M"]

def test_get_data_esp32(setup_esp32):
    """Test the __get_data method of CoreData from esp32 test set."""
    core_data = CoreData("esp32", "3.2.0", str(setup_esp32))
    boards = core_data.boards
    assert "d1_mini32" in boards
    assert boards["d1_mini32"]["name"] == "WEMOS D1 MINI ESP32"
    assert boards["d1_mini32"]["variant"] == "d1_mini32"
    assert boards["d1_mini32"]["flash_size"] == ["4MB"]

def test_find_led_builtin(setup):
    """Test the __find_led_builtin method of CoreData."""
    core_data = CoreData("esp8266", "2.7.4", str(setup))
    assert core_data.boards["d1_mini"]["LED_BUILTIN"] == "2"

def test_wrong_led_builtin_value(setup_wrong_led_builtin_value):
    """Test the __find_led_builtin method of CoreData with wrong LED_BUILTIN value."""
    core_data = CoreData("esp8266", "2.7.4", str(setup_wrong_led_builtin_value))
    boards = core_data.boards
    assert "d1_mini" in boards
    assert boards["d1_mini"]["LED_BUILTIN"] == "N/A"

def test_print_table(setup_wrong_led_builtin_value, capfd):
    """Test the print_table method of CoreData."""
    core_data = CoreData("esp8266", "2.7.4", str(setup_wrong_led_builtin_value))
    # clear the output buffer
    out = capfd.readouterr()
    core_data.print_table(ignore_missing_led=False)
    # Check if the output contains the expected values
    out = capfd.readouterr()
    assert out[0] == "LOLIN(WEMOS) D1 R2 & mini | d1_mini | N/A | ['4M']\n"

def test_print_table_ignore_na_led(setup_wrong_led_builtin_value, capfd):
    """Test the print_table method of CoreData with ignore_missing_led=True."""
    core_data = CoreData("esp8266", "2.7.4", str(setup_wrong_led_builtin_value))
    # clear the output buffer
    out = capfd.readouterr()
    core_data.print_table(ignore_missing_led=True)
    # Check if the output contains the expected values
    out = capfd.readouterr()
    assert out[0] == ""

def test_export_csv(setup_wrong_led_builtin_value, tmpdir):
    """Test the export_csv method of CoreData."""
    file = tmpdir / "esp8266.csv"
    core_data = CoreData("esp8266", "2.7.4", str(setup_wrong_led_builtin_value))
    # clear the output buffer
    core_data.export_csv(filename=file.strpath, ignore_missing_led=False)
    # Check if the output contains the expected values
    assert file.read()== "name,board,LED,flash_size\nLOLIN(WEMOS) D1 R2 & mini,d1_mini,N/A,[4M]\n"

def test_export_csv_ignore_na_led(setup_wrong_led_builtin_value, tmpdir):
    """Test the export_csv method with ignore_missing_led=True."""
    file = tmpdir / "esp8266.csv"
    core_data = CoreData("esp8266", "2.7.4", str(setup_wrong_led_builtin_value))
    # clear the output buffer
    core_data.export_csv(filename=file.strpath, ignore_missing_led=True)
    # Check if the output contains the expected values
    assert file.read()== "name,board,LED,flash_size\n"
