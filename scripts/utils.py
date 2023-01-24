import chalk
from pypinyin import lazy_pinyin
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options


def get_choice(choices, prompt):
    choice = int(input('\n' + prompt + '\n' + '\n'.join(
        map(lambda x: str(x[0] + 1) + ". " + x[1], enumerate(choices))) + '\n'))
    if choice not in range(1, len(choices) + 1):
        error('Invalid choice')
        exit(1)
    return choices[choice - 1]


def info(msg):
    print(chalk.cyan(msg))


def warn(msg):
    print(chalk.yellow(msg))


def error(msg):
    print(chalk.red(msg))


def fetch_leetcode(id):
    options = Options()
    options.headless = True
    driver = webdriver.Chrome(options=options)
    url = f'https://leetcode.cn/contest/{id}'
    info(f'Fetching problems from {url}')
    driver.get(url)
    problems = driver.find_elements(By.XPATH,
                                    '//span[@class=\'badge\']/preceding-sibling::a')
    titles, urls = [problem.text for problem in problems], [
        problem.get_attribute('href') for problem in problems]
    driver.close()
    info('Problems fetched.')
    return titles, urls

def normalize(title):
    title = '-'.join(lazy_pinyin(title))
    return title
