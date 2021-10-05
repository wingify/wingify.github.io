---
layout: post
title: Finding Bughotspots in Source Code
excerpt: Finding Code That Needs Fixing through Bughotspots
authorslug: punit_goswami
author: Punit Goswami
---

### Introduction

We are often faced with the problem of source code that breaks frequently. Or those modules which are very sensitive to changes in them or their upstream modules. And with a new team member joining and having to eventually commit changes in those same modules requires that there be some way to keep track of such pieces of code, other than the human memories. Also finding such spots in source code gives a better perspective of the places which might need refactoring or rethinking the strategy of implementation.
It is obvious to think that prediction of bugs’ occurrence would require multiple parameters chugged into a big neural network to compute what might be the probability of those occurrences. Turns out we can use fewer and simpler metrics to do just that.

### Solution

[Rehman et al.](https://web.archive.org/web/20170706022036id_/http://earlbarr.com/publications/hitmiss.pdf) Note that all you need to have is a history or cache of changes done in the source code and some labels to mark which of the changes were done to fix bugs. Mapping these changes to the files or pieces of code would lead to the places where rework or careful peer review is required. As engineers at Google [here](​​http://google-engtools.blogspot.com/2011/12/bug-prediction-at-google.html) mention, coupling this with a time-decay function, which would reduce the priority of a piece of code as the bug fix done in it becomes older in the face of new bugs surfacing in other pieces of code.

We found that this was beautifully implemented by [Jorge Niedbalski](https://github.com/niedbalski/python-bugspots) but that it had a bug in it for which we opened a [pull request](https://github.com/niedbalski/python-bugspots). Nonetheless, the module worked pretty well so we forked it and made some changes in it for our usage.

The idea here is to read through the `git logs` of a given repository and sift through them searching for commits labeled with specific keywords. This considered along with how frequently and how recent changes were made in the repository tells which piece of code is the hot spot. We use the [vcstools](https://pypi.org/project/vcstools/) library to operate and deal with the version control system repositories.

We first check the path provided to check if it is a valid vcs repository.

```python
def get_current_vcs(path):
    if path is None:
        path = '.'
    for vcs_type in vcs_abstraction.get_registered_vcs_types():
        vcs = vcs_abstraction.get_vcs(vcs_type)
        if vcs.static_detect_presence(path):
            return vcs(path)
    raise Exception("Did not find a valid VCS repository")
```

Then we get the changesets from the specific branch of the repository.

```python
def get_changesets(days_ago):
        current_branch = vcs.get_current_version_label()

        if current_branch != branch:
            vcs._do_checkout(branch)

        for log in vcs.get_log():
            (date, message, id) = (log['date'], log['message'],
                                   log['id'])

            commit_date = date.replace(tzinfo=None)

            if commit_date >= days_ago and \
               description_regex.search(message):
                yield((message, commit_date, vcs.get_affected_files(id)))

```

Here we also check that the changesets should be from the commits within the time period specified and that the commit messages should have the specific keywords. We use the following regex to match any commit messages that have the bug fix keywords.

```python
"^.*([B|b]ug)s?|([f|F]ix(es|ed)?|[c|C]lose(s|d)?)|(([Q|q][F|f])-\d?).*$"
```

Once we have the fix commits from the specified branch and within the desired time-period, we can also proceed to exclude some files which might not be of our interest for computing bug hotspots. This will include dependencies files like package.json, requirements.txt, yarn.lock, or Readme files. This is driven by a boolean parameter.

```python
def remove_excluded_files(fixes):
    exclusion_regex = re.compile(
        r".*(README|package\.json|yarn\.lock|test[s]*).*$")
    for fix in fixes:
        exclusion_files = [file for file in fix[2]
                           if exclusion_regex.search(file)]
        for file in exclusion_files:
            fix[2].remove(file)
    return fixes

```

Then we compute the hotspot factor for each of the files in the changesets procured.

```python
def get_code_hotspots(options):
    commits = get_fix_commits(options.branch, options.days, options.path)

    if options.fileExclusions:
        commits = remove_excluded_files(commits)

    if not commits:
        print(
            '''Did not find commits matching search criteria\n'''
            f'''for repo at: {options.path} branch: {options.branch}''')
        return None

    print_summary(options.path, options.branch, len(commits), options.days)

    (last_message, last_date, last_files) = commits[-1]
    current_dt = datetime.datetime.now()

    print(f'\nFixes\n{("-" * 80)}')

    hotspots = {}

    for message, date, files in commits:
        this_commit_diff = time_diff(current_dt, date)
        last_commit_diff = time_diff(current_dt, last_date)

        factor = this_commit_diff / last_commit_diff

        factor = 1 - factor

        for filename in files:
            if filename not in hotspots:
                hotspots[filename] = 0
            try:
                hotspot_factor = 1/(1+math.exp((-12 * factor) + 12))
            except:
                pass

            hotspots[filename] += hotspot_factor

        print(f'      -{message}')

    sorted_hotspots = sorted(hotspots, key=hotspots.get, reverse=True)

    print(f'\nHotspots\n{("-" * 80)}')
    for k in sorted_hotspots[:options.limit]:
        yield (hotspots[k], k)

```

Along with this, we have added the following parameters to the command line using the [argparse](https://docs.python.org/3/library/argparse.html) module.

#### Parameters supported

| Optional Argument | Description                                                                   | Example usage                         |
|-------------------|-------------------------------------------------------------------------------|---------------------------------------|
| -h, --help        | Shows the help dialog describing usage                                        | bughotspots --help                       |
| --days            | Number of days in history for which commits are considered to compute bug factor, default value: 30                             | bughotspots --days 60                    |
| --limit           | Max amount of file hotspots results to show, default value: 10                              | bughotspots --limit 100                  |
| --branch          | Use a specific branch, default value: 'master'                                | bughotspots --branch feature-branch      |
| --bugsFile        | Use a file with list of bugs to search in commits, default to searching commits with QF issues mentioned                             | bughotspots --bugsFile bugs.csv          |
| --paths           | Provide repository paths to look into, default to search in current directory | bughotspots --paths ../folder1 ../folder2 |
| --fileExclusions           | Exclude changes in dependency files(package.json, requirements.txt),  README and tests from consideration while computing bug hotspots, default value: false | bughotspots --paths ../folder1 ../folder2 |

### Aftermath

Further, we can add the functionality to generate reports through this in markdown or even more beautified HTML reports. If historical trends are kept, then there can be trends plotted using visualization libraries like [Bokeh](https://bokeh.org/).
