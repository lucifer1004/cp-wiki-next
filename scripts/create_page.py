from os import mkdir
from pathlib import Path
from utils import *

from jinja2 import Environment, FileSystemLoader

template_dir = Path(__file__).parent / '..' / 'templates'

templates = [
    'leetcode',
    'blog',
]

leetcode_contests = [
    'weekly',
    'bi-weekly',
    'special',
]

leetcode_prefix = {
    'weekly': 'WC',
    'bi-weekly': 'BC',
    'special': '',
}

leetcode_contest_prefix = {
    'weekly': 'weekly-contest',
    'bi-weekly': 'biweekly-contest',
}

environment = Environment(loader=FileSystemLoader(template_dir))
match get_choice(templates, 'Please choose a template'):
    case 'leetcode':
        contest = get_choice(leetcode_contests, 'Please choose a contest type')
        contest_number = input('\nPlease enter the contest number: ')
        contest_path = (Path(__file__).parent / '..' / Path(
            f'docs/leetcode/{contest}/{leetcode_prefix[contest]}{contest_number}/README.md')).resolve()
        if contest_path.exists():
            warn('File already exists')
            exit(1)
        else:
            template = environment.get_template(f'leetcode.{contest}.md')
            match contest:
                case 'special':
                    content = template.render()
                case other:
                    titles, urls = fetch_leetcode(
                        f'{leetcode_contest_prefix[contest]}-{contest_number}')
                    content = template.render(
                        id=contest_number,
                        titles=titles,
                        urls=urls,
                    )
            folder = contest_path.parent
            if not folder.exists():
                mkdir(folder)
            with open(contest_path, 'w') as f:
                f.write(content)
            info(f'{contest_path} created from template.')
    case other:
        pass
