# Module for finding GN2 files on the local system

from utility.logger import getLogger
logger = getLogger(__name__ )

def find_genofile(name):
    fn = locate(self.genofile, 'genotype')
    logger.debug("Found genofile "+fn)
    return fn
